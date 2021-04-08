const app = require('./app')

const { PORT = 8081 } = process.env
const http = require('http').createServer(app)
http.listen(PORT, () => console.log(`Listening on port ${PORT}`))
