import Blacklist from "../models/blacklist_schema"

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
        const blacklistEntry = Blacklist.deleteOne(req.body, (err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Blacklist entry deleted from database");
            }
        });
    }
}

