export { }
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const routes = require('./routes')


const { NODE_ENV } = process.env

const app = express()
app.use(express.json())
app.enable('trust proxy')
app.use(cors())

if (NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

app.listen(8081, () => {
  console.log('Server running on port 8081')
})
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

module.exports = app
