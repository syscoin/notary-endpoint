import Blacklist from "../models/blacklist_schema";
import bitcoin from "bitcoinjs-lib";
import syscointx from "syscointx-js";
import {  } from 'express'
const network = syscointx.utils.syscoinNetworks.testnet;
interface Error {
  status?: number;
}

export default {
  getBlacklist: function (req: any, res: any) {
    Blacklist.find((err: any, blacklist: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(blacklist);
      }
    });
  },
  addBlacklist: function (req: any, res: any) {
    if (req.body && req.body.address) {
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
    } else {
      const errorType = "No address was included in the request";
      const error = new Error(errorType);
      error.status = 400;
      res.send(error);
      return;
    }
  },

  deleteBlacklist: function (req: any, res: any) {
    if (req.body && req.body.address) {
      try {
        bitcoin.address.toOutputScript(req.body.address, network);
      } catch (e) {
        const errorType = "Invalid address";
        const error = new Error(errorType);
        error.status = 400;
        res.send(error);
        return;
      }
      Blacklist.deleteOne(req.body, (err: any) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Blacklist entry deleted from database");
        }
      });
    } else {
      const errorType = "No address was included in the request";
      const error = new Error(errorType);
      error.status = 400;
      res.send(error);
      return;
    }
  }
};
