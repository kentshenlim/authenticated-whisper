const mongoose = require('mongoose');
const jdenticon = require('jdenticon');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: {
    type: String,
    maxLength: 100,
    required: true,
  },
  username: {
    type: String,
    maxLength: 255,
    unique: true,
    sparse: true, // Don't index if not specified, otherwise will have dup error
    required() {
      return this.password; // username cannot exist without password
    },
  },
  password: {
    type: String,
    required() {
      return this.username; // password cannot exist without username
    },
  },
  email: {
    type: String,
    maxLength: 100,
    unique: true,
    sparse: true, // Email also not required + unique, so use sparse
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email',
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  bio: {
    type: String,
    maxLength: 120,
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [], // MongoDB will set array on undefined actually to prevent err
  },
  created: {
    type: Date,
    default: new Date(),
  },
});

// Virtuals
userSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

userSchema.virtual('friendsCount').get(function () {
  return this.friends.length;
});

userSchema.virtual('displayPicture').get(function () {
  const png = jdenticon.toPng(this.username, 200);
  const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(png)));
  return `data:image/png;base64,${base64}`;
});

userSchema.virtual('joinedAgo').get(function () {
  return formatDistanceToNow(this.created);
});

// Instances
userSchema.methods.isFriend = function (friendID) {
  const { friends } = this;
  for (let i = 0; i < friends.length; i += 1) {
    // Allow passing string friendID rather than full-fledged ObjectId
    if (friends[i].toString() === friendID) return true;
    // Also allow passing friendID as full-fledged ObjectId
    if (friends[i].toString() === friendID.toString()) return true;
  }
  return false;
};

userSchema.methods.addFriend = async function (friendID) {
  this.friends.push(friendID);
  await this.save();
};

userSchema.methods.removeFriend = async function (friendID) {
  const { friends } = this;
  for (let i = 0; i < friends.length; i += 1) {
    if (friends[i].toString() === friendID) {
      friends.splice(i, 1);
      break;
    }
  }
  await this.save();
};

userSchema.methods.canViewHisPost = function (userID) {
  if (userID === this._id.toString()) return true; // Can view own post
  if (userID.toString() === this._id.toString()) return true; // Can view own post
  return this.isFriend(userID); // Can view only friends' post
};

// Statics
// Note when using this method, you need to catch the error outside
// For example await User.beFriend(id1, id2), then catch.
// Catching error here is useless, need next(err)
userSchema.statics.beFriend = async function (id1, id2) {
  const [user1, user2] = await Promise.all([this.findById(id1).exec(), this.findById(id2).exec()]);
  if (user1.isFriend(id2)) return;
  await Promise.all([user1.addFriend(id2), user2.addFriend(id1)]);
};

userSchema.statics.unFriend = async function (id1, id2) {
  const [user1, user2] = await Promise.all([this.findById(id1).exec(), this.findById(id2).exec()]);
  await Promise.all([user1.removeFriend(id2), user2.removeFriend(id1)]);
};

module.exports = mongoose.model('User', userSchema);
