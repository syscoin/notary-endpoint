"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_error_1 = __importDefault(require("../models/transaction_error"));
var logTransactionError = function (error) {
    return new transaction_error_1.default(error).save();
};
exports.default = logTransactionError;
