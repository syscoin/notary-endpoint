import Blacklist from "../models/blacklist_schema"
const bitcoin = require("bitcoinjs-lib");
const syscointx = require("syscointx-js");
const network = syscointx.utils.syscoinNetworks.testnet;
interface Error {
    status?: number;
}

module.exports = {

    getBlacklist : function(req: any, res: any) {

        const blacklist = Blacklist.find((err: any, blacklist: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(blacklist);
            }
        });
    },
    addBlacklist : function(req: any, res: any) {
        try {
            bitcoin.address.toOutputScript(req.body.address, network);
        } catch (e) {
            const errorType = "Invalid address";
            const error = new Error(errorType);
            error.status = 400;
            res.send(error);
            return;
        }
        const blacklistEntry = new Blacklist(req.body);
        blacklistEntry.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(blacklistEntry);
            }
        });
    },

    deleteBlacklist : function(req: any, res: any) {
        try {
            bitcoin.address.toOutputScript(req.body.address, network);
        } catch (e) {
            const errorType = "Invalid address";
            const error = new Error(errorType);
            error.status = 400;
            res.send(error);
            return;
        }
        const blacklistEntry = Blacklist.deleteOne(req.body, (err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Blacklist entry deleted from database");
            }
        });
    }
}

