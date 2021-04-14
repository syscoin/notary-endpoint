export { }
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const routes = require('./routes')

const initDb = require('./db')

const { NODE_ENV } = process.env

const app = express()
// Initialize Db connection. App wont start until it is stablished.
initDb().then((db: any) => {
    app.use((req: any, res: any, next: any) => {
        // Appends db connection to request object for easier access within controllers.
        req.db = db

        return next()
    })


    app.use(express.json())
    app.enable('trust proxy')
    app.use(cors())

    if (NODE_ENV !== 'production') {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    // error handler middleware
    app.use((error: any, req: any, res: any, next: any) => {
      res.status(error.status || 500).send({
        error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error'
        }
      })
    })

    routes(app)
}).catch((err: Error) => {
    console.log('Not able to set up DB. Error:', err)
})

module.exports = app
