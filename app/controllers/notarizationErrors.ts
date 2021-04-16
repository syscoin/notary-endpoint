export {};
const TransactionError = require("../models/transaction_error");

module.exports = {
  getNotarizationErrors: async (req: any, res: any) => {
    try {
      const notarizationErrors = await TransactionError.find({});
      res.send({ notarizationErrors });
    } catch (error) {
      res.send({ notarizationErrors: [] });
    }
  },
  deleteNotarizationErrors: async (req: any, res: any) => {
    try {
      const result = await TransactionError.deleteMany({});
      res.send({ success: true, result });
    } catch (error) {
      res.send({ success: false });
    }
  }
};
