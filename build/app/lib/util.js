"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputAddressesFromVouts = exports.getInputAddressesFromVins = void 0;
var bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
var syscointx_js_1 = __importDefault(require("syscointx-js"));
var network = syscointx_js_1.default.utils.syscoinNetworks.testnet;
function getInputAddressesFromVins(ins) {
    var result = [];
    ins.forEach(function (input) {
        try {
            var p2sh = bitcoinjs_lib_1.default.payments.p2sh({
                witness: input.witness,
                network: network,
                input: input.script
            });
            // Logger.info('Decoded', input.script.toString(), 'to', p2sh.address);
            result.push(p2sh.address);
        }
        catch (e) {
            // Logger.info('Failed to decode', input.script.toString(), ' s p2sh');
            try {
                var p2wpkh = bitcoinjs_lib_1.default.payments.p2wpkh({
                    witness: input.witness,
                    network: network,
                    input: input.script
                });
                // Logger.info('Decoded', input, 'to', p2wpkh.address);
                result.push(p2wpkh.address);
            }
            catch (e) {
                // console.error('Failed to decode', input.witness.toString(), 'as p2wpkh');
            }
        }
    });
    return result;
}
exports.getInputAddressesFromVins = getInputAddressesFromVins;
function getOutputAddressesFromVouts(outs) {
    var result = [];
    outs.forEach(function (out) {
        var address;
        try {
            address = bitcoinjs_lib_1.default.address.fromOutputScript(out.script, network);
        }
        catch (e) { }
        if (address)
            result.push(address);
    });
    return result;
}
exports.getOutputAddressesFromVouts = getOutputAddressesFromVouts;
