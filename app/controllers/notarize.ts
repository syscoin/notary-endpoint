const bitcoin = require('bitcoinjs-lib')
const syscointx = require('syscointx-js')

const WIF = 'cTTK8jcKcqffHJkoYGYxyM2LBwmDsvYimjXahzgdy94MRbupsKJF'
const assetGuid = '341906151'
const network = syscointx.utils.syscoinNetworks.testnet
interface Error {
    status?: number;
}

module.exports = async (req: any, res: any, next: any) => {
      if (req.body && req.body.tx) {
        const txHex = req.body.tx
        const tx = bitcoin.Transaction.fromHex(txHex)
        if (!tx || syscointx.utils.isAssetAllocationTx(tx.version) !== true) {
          const error = new Error('Not an allocation transaction')
          error.status = 404
          next(error)
          return
        }
        let assets = syscointx.getAssetsFromTx(tx)
        if (!assets.has(assetGuid)) {
          const error = new Error('Asset to be notarized not found in the transaction')
          error.status = 404
          next(error)
          return
        }
        assets = new Map()
        assets.set(assetGuid, {})
        if (syscointx.getNotarizationSigHash(tx, assets, network) !== true) {
          const error = new Error('Could not get notary sighash')
          error.status = 404
          next(error)
          return
        }
        if (syscointx.signNotarizationSigHashesWithWIF(assets, WIF, network) !== true) {
          const error = new Error('Could not sign notary sighash')
          error.status = 403
          next(error)
          return
        }
        if (syscointx.addNotarizationSignatures(tx.version, assets, tx.outs) === -1) {
          const error = new Error('Could not add notary signature')
          error.status = 400
          next(error)
          return
        }
        const jsonOut = syscointx.createNotarizationOutput(assets)
        res.send({ sigs: jsonOut })
      } else {
        const error = new Error('No transaction included in body')
        error.status = 400
        next(error)
      }
}

