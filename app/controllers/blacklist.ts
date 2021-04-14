import Blacklist from "../models"

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
        const blacklistEntry = Blacklist.deleteOne({ _id: req.params.id }, (err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Blacklist entry deleted from database");
            }
        });
    }
}

