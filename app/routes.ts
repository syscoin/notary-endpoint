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
     * description: "Submits a tx to be notarized"
     * responses:
     *   "200":
     *     description: "Returns notarized output"
     *     schema:
     *       type: "string"
     *   "400":
     *     description: "Returns error: Could not add notary signature"
     *     schema:
     *       type: "string"
     *   "403":
     *     description: "Returns error: Could not sign notary sighash"
     *     schema:
     *       type: "string"
     *   "404":
     *     description: "Returns error: Invalid tx; not an asset tx of right asset guid or cannot get notary sighash or blacklisted"
     *     schema:
     *       type: "string"
     * parameters:
     *   - in: body
     *     name: tx
     *     required: true
     *     description: transaction hex to be notarized
     *     schema:
     *       type: object
     *       required:
     *         - tx
     *       properties:
     *         address:
     *           type: string
     */
    app.post('/notarize', controllers.notarize);
    
    /**
     * @api [get] /blacklist
     * description: "Returns the blacklist"
     * responses:
     *   "200":
     *     description: "Returns current blacklisted addresses"
     *     schema:
     *       type: "array"
     *       items:
     *         type: "string"
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
     *     description: "Returns record of notarization errors"
     *     schema:
     *       type: "string"
     */
     app.get('/notarization-errors', controllers.notarizationErrors.getNotarizationErrors);

     /**
     * @api [delete] /notarization-errors
     * description: "Deletes all notarization errors"
     * responses:
     *   "200":
     *     description: "Returns status"
     *     schema:
     *       type: "string"
     */
      app.delete('/notarization-errors', controllers.notarizationErrors.deleteNotarizationErrors);
};
