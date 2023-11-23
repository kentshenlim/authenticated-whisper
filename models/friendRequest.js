// Pending friend requests
// Do not store accepted or rejected requests
const mongoose = require('mongoose');

const { Schema } = mongoose;

const fRSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created: { // Required to limit friend request
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Friend_request', fRSchema);
