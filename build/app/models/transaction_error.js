"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var transactionErrorSchema = new mongoose_1.default.Schema({
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
    }
});
var TransactionError = mongoose_1.default.model("TransactionError", transactionErrorSchema);
exports.default = TransactionError;
