const controllers = require('./controllers');
const middlewares = require('./middlewares');

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
    app.get('/hello', (req: any, res: any) => res.send({ message: 'Hello World' }));

    /**
     * @api [get] /health
     * description: "Returns the state of the SYS node running in VPS and some additional system data."
     * responses:
     *   "200":
     *     description: "Returns general VPS status"
     *     schema:
     *       type: "string"
     */
    app.get('/health', controllers.health);

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
     * parameters:
     *   - in: body
     *     name: tx
     *     required: true
     *     type: string
     *     description: transaction hex to be notarized
     */
    app.post('/notarize', controllers.notarize);
    
    /**
     * @api [get] /blacklist
     * description: "Returns the blacklist"
     * responses:
     *   "200":
     *     description: "Returns current blacklisted addresses"
     *     schema:
     *       type: "string"
     */
    app.get('/blacklist', controllers.blacklist.getBlacklist);

    /**
     * @api [post] /blacklist
     * description: "Adds an address entry to the blacklist"
     * responses:
     *   "200":
     *     description: "Returns status"
     *     schema:
     *       type: "string"
     *   "400":
     *     description: "Bad request"
     * parameters:
     *   - in: body
     *     name: address
     *     required: true
     *     type: string
     *     description: address to be added to the blacklist
     *     schema:
     *       type: object
     *       required:
     *         - address
     *       properties:
     *         address:
     *           type: string
     */
    app.post('/blacklist', controllers.blacklist.addBlacklist);

    /**
     * @api [delete] /blacklist
     * description: "Deletes an address entry in the blacklist"
     * responses:
     *   "200":
     *     description: "Returns status"
     *     schema:
     *       type: "string"
     * parameters:
     *   - in: body
     *     name: address
     *     required: true
     *     type: string
     *     description: address to be removed from the blacklist
     *     schema:
     *       type: object
     *       required:
     *         - address
     *       properties:
     *         address:
     *           type: string
     */
    app.delete('/blacklist', controllers.blacklist.deleteBlacklist);

    /**
     * @api [get] /notarization-errors
     * description: "returns a JSON array of the notarization error objects in the DB"
     * responses:
     *   "200":
     *     description: "Returns general VPS status"
     *     schema:
     *       type: "array"
     */
     app.get('/notarization-errors', controllers.notarizationErrors);
};
