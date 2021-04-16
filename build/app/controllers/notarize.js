"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
var syscointx_js_1 = __importDefault(require("syscointx-js"));
var logTransactionError_1 = __importDefault(require("../lib/logTransactionError"));
var blacklist_schema_1 = __importDefault(require("../models/blacklist_schema"));
var util_1 = require("../lib/util");
var WIF = "cTTK8jcKcqffHJkoYGYxyM2LBwmDsvYimjXahzgdy94MRbupsKJF";
// const assetGuid = '341906151'
var assetGuid = "2201781193";
var network = syscointx_js_1.default.utils.syscoinNetworks.testnet;
exports.default = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var txHex, tx, errorType, error, txid, txObject, inputAddresses, outputAddresses, impactedAddresses, foundInBlacklist, _i, impactedAddresses_1, address, count, errorType, error, errorType, error, assets, errorType, error, errorType, error, signature, errorType, error, notarizationError, errorType, error, jsonOut, errorType, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.body && req.body.tx)) return [3 /*break*/, 7];
                txHex = req.body.tx;
                tx = null;
                try {
                    tx = bitcoinjs_lib_1.default.Transaction.fromHex(txHex);
                }
                catch (e) {
                    errorType = "Invalid transaction";
                    error = new Error(errorType);
                    error.status = 400;
                    logTransactionError_1.default({
                        txid: null,
                        assetGuid: assetGuid,
                        txObject: null,
                        impactedAddresses: [],
                        errorTypes: [errorType]
                    });
                    next(error);
                }
                txid = tx.getId();
                txObject = JSON.stringify(tx);
                inputAddresses = util_1.getInputAddressesFromVins(tx.ins);
                outputAddresses = util_1.getOutputAddressesFromVouts(tx.outs);
                impactedAddresses = inputAddresses.concat(outputAddresses);
                foundInBlacklist = false;
                _i = 0, impactedAddresses_1 = impactedAddresses;
                _a.label = 1;
            case 1:
                if (!(_i < impactedAddresses_1.length)) return [3 /*break*/, 4];
                address = impactedAddresses_1[_i];
                return [4 /*yield*/, blacklist_schema_1.default.countDocuments({ address: address })];
            case 2:
                count = _a.sent();
                if (count > 0) {
                    foundInBlacklist = true;
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (foundInBlacklist) {
                    errorType = "Transaction contains blacklisted address";
                    error = new Error(errorType);
                    error.status = 404;
                    logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    });
                    next(error);
                    return [2 /*return*/];
                }
                if (!tx || syscointx_js_1.default.utils.isAssetAllocationTx(tx.version) !== true) {
                    errorType = "Not an allocation transaction";
                    error = new Error(errorType);
                    error.status = 404;
                    logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    });
                    next(error);
                    return [2 /*return*/];
                }
                assets = syscointx_js_1.default.getAssetsFromTx(tx);
                if (!assets.has(assetGuid)) {
                    errorType = "Asset to be notarized not found in the transaction";
                    error = new Error(errorType);
                    error.status = 404;
                    logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    });
                    next(error);
                    return [2 /*return*/];
                }
                assets = new Map();
                assets.set(assetGuid, {});
                if (syscointx_js_1.default.getNotarizationSigHash(tx, assets, network) !== true) {
                    errorType = "Could not get notary sighash";
                    error = new Error(errorType);
                    error.status = 404;
                    logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    });
                    next(error);
                    return [2 /*return*/];
                }
                signature = null;
                try {
                    signature = syscointx_js_1.default.signNotarizationSigHashesWithWIF(assets, WIF, network);
                }
                catch (e) { }
                if (!(signature !== true)) return [3 /*break*/, 6];
                errorType = "Could not sign notary sighash";
                error = new Error(errorType);
                error.status = 403;
                return [4 /*yield*/, logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    })];
            case 5:
                notarizationError = _a.sent();
                res.status(error.status).send({
                    error: {
                        status: error.status,
                        message: error.message,
                        notarizationError: notarizationError
                    }
                });
                return [2 /*return*/];
            case 6:
                if (syscointx_js_1.default.addNotarizationSignatures(tx.version, assets, tx.outs) === -1) {
                    errorType = "Could not add notary signature";
                    error = new Error(errorType);
                    error.status = 400;
                    logTransactionError_1.default({
                        txid: txid,
                        assetGuid: assetGuid,
                        txObject: txObject,
                        impactedAddresses: impactedAddresses,
                        errorTypes: [errorType]
                    });
                    next(error);
                    return [2 /*return*/];
                }
                jsonOut = syscointx_js_1.default.createNotarizationOutput(assets);
                res.send({ sigs: jsonOut });
                return [3 /*break*/, 8];
            case 7:
                errorType = "No transaction included in body";
                error = new Error(errorType);
                error.status = 400;
                logTransactionError_1.default({
                    txid: null,
                    assetGuid: assetGuid,
                    txObject: null,
                    impactedAddresses: [],
                    errorTypes: [errorType]
                });
                next(error);
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
