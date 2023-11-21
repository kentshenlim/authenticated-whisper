const mongoose = require('mongoose');
const formatDate = require('date-fns/format');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

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

// Virtuals
postSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

postSchema.virtual('patCount').get(function () {
  return this.pat.length;
});

postSchema.virtual('dayString').get(function () {
  return formatDate(this.created, 'dd');
});

postSchema.virtual('monthString').get(function () {
  return formatDate(this.created, 'MMM');
});

postSchema.virtual('yearString').get(function () {
  return formatDate(this.created, 'yyyy');
});

postSchema.virtual('agoString').get(function () {
  return formatDistanceToNow(this.created);
});

postSchema.virtual('displayDateString').get(function () {
  return formatDate(this.created, 'd MMMM yyyy kk:mm');
});

module.exports = mongoose.model('Post', postSchema);
