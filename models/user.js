const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: {
    type: String,
    maxLength: 100,
    required: true,
  },
  username: {
    type: String,
    maxLength: 20,
    unique: true,
    required() {
      return this.password; // username cannot exist without password
    },
  },
  password: {
    type: String,
    maxLength: 50, // Limited by bcryptjs
    required() {
      return this.username; // password cannot exist without username
    },
  },
  email: {
    type: String,
    maxLength: 100,
    unique: true,
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
  age: {
    type: Number,
  },
  bio: {
    type: String,
    maxLength: 120,
  },
  displayPicture: {
    type: Schema.Types.Buffer,
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

// Instances
userSchema.methods.addFriend = async function (friendID) {
  this.friends.push(friendID);
  await this.save();
};

userSchema.methods.isFriend = function (friendID) {
  const { friends } = this;
  for (let i = 0; i < friends.length; i += 1) {
    // Safer to compare by strings
    if (friends[i].toString() === friendID.toString()) return true;
  }
  return false;
};

// Statics
// Note when using this method, you need to catch the error outside
// For example await User.beFriend(id1, id2), then catch.
// Catching error here is useless, need next(err)
userSchema.statics.beFriend = async function (id1, id2) {
  const [user1, user2] = await Promise.all([this.findById(id1), this.findById(id2)]);
  if (user1.isFriend(id2)) return;
  await Promise.all([user1.addFriend(id2), user2.addFriend(id1)]);
};

module.exports = mongoose.model('User', userSchema);
