export {};
const TransactionError = require("../models/transaction_error");

module.exports = async (req: any, res: any) => {
  try {
    const errors = await TransactionError.find({});
    res.send({ errors });
  } catch (error) {
    res.send({ errors: [] });
  }
};
