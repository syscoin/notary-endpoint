export {}
const TransactionError = require('../models/transaction_error')

const logTransactionError = (error: object) => {
  return new TransactionError(error).save();
};

module.exports = logTransactionError;