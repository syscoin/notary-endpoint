export {}
const system = require('systeminformation')

module.exports = async (req: any, res: any) => {
    // No params/body

    // Returns general wallet / connection / system status info.
    let diskSpaceRemaining

    try {
        diskSpaceRemaining = await system.fsSize()
        diskSpaceRemaining = Number(((diskSpaceRemaining[0].size - diskSpaceRemaining[0].used) / (1024 * 1024)).toFixed(2))
    } catch(err) {
        console.log(err)
        diskSpaceRemaining = 'error'
    }

    return res.send({
        connection: {
            db: req.db.s.db.serverConfig.isConnected()
        },
        diskSpaceRemaining
    })
}
