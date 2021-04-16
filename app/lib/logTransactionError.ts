import TransactionError from "../models/transaction_error";

const logTransactionError = (error: object) => {
  return new TransactionError(error).save();
};

export default logTransactionError;
