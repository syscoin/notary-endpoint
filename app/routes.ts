const controllers = require('./controllers')
const middlewares = require('./middlewares')

module.exports = (app: any) => {
    // app = Express app
    // Set up routes.
    /**
     * @api [get] /hello
     * description: "Returns Hello World"
     * responses:
     *   "200":
     *     description: "Hello World"
     *     schema:
     *       type: "string"
     */
    app.get('/hello', (req: any, res: any) => res.send({ message: 'Hello World' }))

    /**
     * @api [get] /health
     * description: "Returns the state of the SYS node running in VPS and some additional system data."
     * responses:
     *   "200":
     *     description: "Returns general VPS status"
     *     schema:
     *       type: "string"
     */
    app.get('/health', controllers.health)

    /**
     * @api [post] /notarize
     * description: "Returns the state of the SYS node running in VPS and some additional system data."
     * responses:
     *   "200":
     *     description: "Returns general VPS status"
     *     schema:
     *       type: "string"
     *   "400":
     *     description: "Returns error"
     *     schema:
     *       type: "string"
     *   "403":
     *     description: "Returns error"
     *     schema:
     *       type: "string"
     *   "404":
     *     description: "Returns error"
     *     schema:
     *       type: "string"
     */
    app.post('/notarize', controllers.notarize)

    /**
     * @api [get] /notarization-errors
     * description: "returns a JSON array of the notarization error objects in the DB"
     * responses:
     *   "200":
     *     description: "Returns general VPS status"
     *     schema:
     *       type: "array"
     */
     app.get('/notarization-errors', controllers.notarizationErrors)
}
