const bitcoin = require("bitcoinjs-lib");
const syscointx = require("syscointx-js");
const logTransactionError = require("../lib/logTransactionError");
const WIF = "cTTK8jcKcqffHJkoYGYxyM2LBwmDsvYimjXahzgdy94MRbupsKJF";
// const assetGuid = '341906151'
const assetGuid = "2201781193";
const network = syscointx.utils.syscoinNetworks.testnet;
interface Error {
  status?: number;
}

module.exports = async (req: any, res: any, next: any) => {
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
        errorTypes: [errorType],
      });

      next(error);
    }

    const txid = tx.getId();
    const txObject = JSON.stringify(tx);
    const impactedAddresses: string[] = [];

    tx.outs.forEach((out: any) => {
      try {
        const address = bitcoin.address.fromOutputScript(out.script, network);
        impactedAddresses.push(address);
      } catch (error) {}
    });

    if (!tx || syscointx.utils.isAssetAllocationTx(tx.version) !== true) {
      const errorType = "Not an allocation transaction";
      const error = new Error(errorType);
      error.status = 404;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType],
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
        errorTypes: [errorType],
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
        errorTypes: [errorType],
      });

      next(error);
      return;
    }

    if (
      syscointx.signNotarizationSigHashesWithWIF(assets, WIF, network) !== true
    ) {
      const errorType = "Could not sign notary sighash";
      const error = new Error(errorType);
      error.status = 403;

      logTransactionError({
        txid,
        assetGuid,
        txObject,
        impactedAddresses,
        errorTypes: [errorType],
      });

      next(error);
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
        errorTypes: [errorType],
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
      errorTypes: [errorType],
    });

    next(error);
  }
};
