export {}
const mongoose = require('mongoose');

const transactionErrorSchema = new mongoose.Schema({
  txid: {
    type: String,
    required: true
  },
  assetGuid: {
    type: String,
    required: true
  },
  txObject: {
    type: String,
    required: true
  },
  impactedAddresses: {
    type: [String],
    required: true
  },
  errorTypes: {
    type: [String],
    required: true
  },
})

const TransactionError = mongoose.model('TransactionError', transactionErrorSchema);

module.exports = TransactionError