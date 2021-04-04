const app = require('./app')
const initDb = require('./db')
const http = require('http').createServer(app)
const { PORT = 8000, NODE_ENV } = process.env

// Initialize Db connection. App wont start until it is stablished.
initDb().then((db: any) => {

    app.use((req: any, res: any, next: any) => {
        // Appends db connection to request object for easier access within controllers.
        req.db = db

        return next()
    })

    http.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}).catch((err: Error) => {
    console.log('Not able to set up DB. Error:', err)
})
