const mongoose = require('mongoose');
const formatDate = require('date-fns/format');

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
postSchema.virtual('patCount').get(function () {
  return this.pat.length;
});

postSchema.virtual('dayString').get(function () {
  return formatDate(this.created, 'd');
});

postSchema.virtual('monthString').get(function () {
  return formatDate(this.created, 'MMM');
});

module.exports = mongoose.model('Post', postSchema);
