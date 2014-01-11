var _ = require('lodash');

/**
 * defaultsDeep
 *
 * Implement a deep version of `_.defaults`.
 *
 * @api private
 */
_.defaultsDeep = _.partialRight(_.merge, _.defaults);



module.exports = _;
