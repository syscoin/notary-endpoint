export {}
const mongoose = require('mongoose');

const transactionErrorSchema = new mongoose.Schema({
  txid: {
    type: String
  },
  assetGuid: {
    type: String
  },
  txObject: {
    type: String
  },
  impactedAddresses: {
    type: [String]
  },
  errorTypes: {
    type: [String]
  },
})

const TransactionError = mongoose.model('TransactionError', transactionErrorSchema);

module.exports = TransactionError