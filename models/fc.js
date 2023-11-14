const mongoose = require('mongoose');

const { Schema } = mongoose;

const fcSchema = new Schema({
  provider: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Federated_credential', fcSchema);
