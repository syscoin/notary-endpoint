export {}
const mongoose = require('mongoose');

const transactionErrorSchema = new mongoose.Schema({
  tx: {
    type: String,
    required: true,
    index: true,
  },
  assetGuid: {
    type: String,
    required: true,
    index: true
  },
  impactedAddresses: {
    type: [String],
    required: true
  },
  errorType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('transactionErrorSchema', transactionErrorSchema);
