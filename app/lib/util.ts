const bitcoin = require("bitcoinjs-lib");
const network = syscointx.utils.syscoinNetworks.testnet;

export function getInputAddressesFromVins(ins) {
    const result = [];
    ins.forEach((input) => {
        try {
            const p2sh = bitcoin.payments.p2sh({
                witness: input.witness,
                network: network,
                input: input.script
            });

            // Logger.info('Decoded', input.script.toString(), 'to', p2sh.address);
            result.push(p2sh.address);
        } catch (e) {
            // Logger.info('Failed to decode', input.script.toString(), ' s p2sh');
            try {
                const p2wpkh = bitcoin.payments.p2wpkh({
                    witness: input.witness,
                    network: network,
                    input: input.script
                });

                // Logger.info('Decoded', input, 'to', p2wpkh.address);
                result.push(p2wpkh.address);
            } catch (e) {
                // console.error('Failed to decode', input.witness.toString(), 'as p2wpkh');
            }
        }
    });

    return result;
}

export function getOutputAddressesFromVouts(outs) {
    let result = [];
    outs.forEach((out) => {
        let address;
        try {
            address = bitcoin.address.fromOutputScript(out.script, network);
        } catch (e) {
        }

        if (address) result.push(address);
    });

    return result;
}

