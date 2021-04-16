import bitcoin from "bitcoinjs-lib";
import syscointx from "syscointx-js";
import logTransactionError from "../lib/logTransactionError";
import Blacklist from "../models/blacklist_schema";
import {
  getInputAddressesFromVins,
  getOutputAddressesFromVouts
} from "../lib/util";

const WIF = "cTTK8jcKcqffHJkoYGYxyM2LBwmDsvYimjXahzgdy94MRbupsKJF";
// const assetGuid = '341906151'
const assetGuid = "2201781193";
const network = syscointx.utils.syscoinNetworks.testnet;

interface Error {
  status?: number;
}

export default async (req: any, res: any, next: any) => {
  if (req.body && req.body.tx) {
    const txHex = req.body.tx;
    let tx = null;

    try {
      tx = bitcoin.Transaction.fromHex(txHex);
    } catch (e) {
      const errorType = "Invalid transaction";
      const error = new Error(errorType);
      error.status = 400;

      logTransactionError({
        txid: null,
        assetGuid: assetGuid,
        txObject: null,
        impactedAddresses: [],
        errorTypes: [errorType]
      });

      next(error);
    }

    const txid = tx.getId();
    const txObject = JSON.stringify(tx);

    const inputAddresses: string[] = getInputAddressesFromVins(tx.ins);
    const outputAddresses: string[] = getOutputAddressesFromVouts(tx.outs);

    const impactedAddresses: string[] = inputAddresses.concat(outputAddresses);

    /* Check blacklist */
    let foundInBlacklist = false;
    for (const address of impactedAddresses) {
      const count = await Blacklist.countDocuments({ address: address });
      if (count > 0) {
        foundInBlacklist = true;
      }
    }
    if (foundInBlacklist) {
      const errorType = "Transaction contains blacklisted address";
      const error = new Error(errorType);
      error.status = 404;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      next(error);
      return;
    }

    if (!tx || syscointx.utils.isAssetAllocationTx(tx.version) !== true) {
      const errorType = "Not an allocation transaction";
      const error = new Error(errorType);
      error.status = 404;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      next(error);
      return;
    }

    let assets = syscointx.getAssetsFromTx(tx);
    if (!assets.has(assetGuid)) {
      const errorType = "Asset to be notarized not found in the transaction";
      const error = new Error(errorType);
      error.status = 404;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      next(error);
      return;
    }

    assets = new Map();
    assets.set(assetGuid, {});
    if (syscointx.getNotarizationSigHash(tx, assets, network) !== true) {
      const errorType = "Could not get notary sighash";
      const error = new Error(errorType);
      error.status = 404;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      next(error);
      return;
    }

    let signature = null;
    try {
      signature = syscointx.signNotarizationSigHashesWithWIF(
        assets,
        WIF,
        network
      );
    } catch (e) {}

    if (signature !== true) {
      const errorType = "Could not sign notary sighash";
      const error = new Error(errorType);
      error.status = 403;

      const notarizationError = await logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      res.status(error.status).send({
        error: {
          status: error.status,
          message: error.message,
          notarizationError
        }
      });

      return;
    }

    if (
      syscointx.addNotarizationSignatures(tx.version, assets, tx.outs) === -1
    ) {
      const errorType = "Could not add notary signature";
      const error = new Error(errorType);
      error.status = 400;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType]
      });

      next(error);
      return;
    }
    const jsonOut = syscointx.createNotarizationOutput(assets);
    res.send({ sigs: jsonOut });
  } else {
    const errorType = "No transaction included in body";
    const error = new Error(errorType);
    error.status = 400;

    logTransactionError({
      txid: null,
      assetGuid,
      txObject: null,
      impactedAddresses: [],
      errorTypes: [errorType]
    });

    next(error);
  }
};
