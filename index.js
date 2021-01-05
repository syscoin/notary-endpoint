const express = require("express");
const syscoin = require('@syscoin/syscoin-js');

const syscoinClient = new syscoin.SyscoinRpcClient({host: 'localhost', rpcPort: '18370', username: 'username', password: 'password'});
const notaryAddress = 'tsys1qm4vy6pdfyz4dflwwjstxqn30wlynrsl4rz4n4v';
const asset_guid = '2102391361';

var app = express();
app.use(express.json());
app.listen(8081, () => {
  console.log("Server running on port 8081");
});
app.post("/notarize", async (req, res, next) => {
  // const reply = await getBlockchainInfo();
  if(req.body && req.body.tx) {
    const tx_hex = req.body.tx;
    console.log("tx:", tx_hex);
    const sighash = await getNotarySigHash(tx_hex);
    console.log("sighash:", sighash);
    const signedhash = await signHash(sighash);
    console.log("signedhash:", signedhash);
    const updatedtx = await assetTransactionNotarize(tx_hex, signedhash);
        console.log("updatedtx:", updatedtx);
     res.json({'sig': signedhash});
  }
});

async function getBlockchainInfo() {
  try {
    return await syscoinClient.callRpc("getblockchaininfo", []).call();
  } catch (e) {
    console.log("ERR getChainTips", JSON.stringify(e.response.data.error));
  }
}

async function signHash(sighash) {
  try {
    return await syscoinClient.callRpc("signhash",[notaryAddress, sighash] ).call();
  } catch (e) {
    console.log("ERR signhash", JSON.stringify(e.response.data.error));
  }
}

async function getNotarySigHash(tx) {
  try {
    return await syscoinClient.callRpc("getnotarysighash", [tx, asset_guid]).call();
  } catch (e) {
    console.log("ERR getnotarysighash", JSON.stringify(e.response.data.error));
  }
}
async function assetTransactionNotarize(tx, signedhash) {
  try {
    return await syscoinClient.callRpc("assettransactionnotarize", [tx, asset_guid, signedhash]).call();
  } catch (e) {
    console.log("ERR assettransactionnotarize", JSON.stringify(e.response.data.error));
  }
}
