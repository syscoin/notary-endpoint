const health = require('./health');
const notarize = require('./notarize');
import { getBlacklist, addBlacklist, deleteBlacklist } from './blacklist';
const blacklist = require('./blacklist');

module.exports = {
    health,
    notarize,
    blacklist
}
