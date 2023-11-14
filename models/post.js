const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  content: {
    type: String,
    maxLength: 500,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pat: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  created: {
    type: Date,
    default: new Date(),
  },
});

postSchema.virtual('url').get(function () {
  return `/post/${this.id}`;
});

postSchema.virtual('patCount').get(function () {
  return this.pat.length;
});

module.exports = mongoose.model('Post', postSchema);
