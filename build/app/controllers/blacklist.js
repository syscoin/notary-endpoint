"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blacklist_schema_1 = __importDefault(require("../models/blacklist_schema"));
var bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
var syscointx_js_1 = __importDefault(require("syscointx-js"));
var network = syscointx_js_1.default.utils.syscoinNetworks.testnet;
exports.default = {
    getBlacklist: function (req, res) {
        blacklist_schema_1.default.find(function (err, blacklist) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(blacklist);
            }
        });
    },
    addBlacklist: function (req, res) {
        if (req.body && req.body.address) {
            try {
                bitcoinjs_lib_1.default.address.toOutputScript(req.body.address, network);
            }
            catch (e) {
                var errorType = "Invalid address";
                var error = new Error(errorType);
                error.status = 400;
                res.send(error);
                return;
            }
            var blacklistEntry_1 = new blacklist_schema_1.default(req.body);
            blacklistEntry_1.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(blacklistEntry_1);
                }
            });
        }
        else {
            var errorType = "No address was included in the request";
            var error = new Error(errorType);
            error.status = 400;
            res.send(error);
            return;
        }
    },
    deleteBlacklist: function (req, res) {
        if (req.body && req.body.address) {
            try {
                bitcoinjs_lib_1.default.address.toOutputScript(req.body.address, network);
            }
            catch (e) {
                var errorType = "Invalid address";
                var error = new Error(errorType);
                error.status = 400;
                res.send(error);
                return;
            }
            blacklist_schema_1.default.deleteOne(req.body, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Blacklist entry deleted from database");
                }
            });
        }
        else {
            var errorType = "No address was included in the request";
            var error = new Error(errorType);
            error.status = 400;
            res.send(error);
            return;
        }
    }
};
