const MongoClient = require('mongodb').MongoClient
const MONGO_URI = process.env.DB_URI || 'mongodb://mongo:27017'

module.exports = () => new Promise((resolve, reject) => {
    // Initialize MongoDB connection on app start.
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true })

    client.connect((err: Error) => {
        if (err) {
            return reject('error while connecting to db')
        }
        const db = client.db(process.env.DB_NAME)

        resolve(db.collection('orders'))
    })
})
