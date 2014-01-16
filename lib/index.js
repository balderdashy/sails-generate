/**
 * Module dependencies
 */

var generate = require('./generate');



/**
 * Generate module(s)
 *
 * @param  {Object}   scope [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
module.exports = function (scope, cb) {

	// TODO: get config
	var config = {};

	if (!scope.generatorType) {
		return cb(new Error('generatorTypeUndefined'));
	}

	// TODO: lookup configured module name for this generatorType:
	var module = 'sails-generate-' + scope.generatorType;

	// Try to load the generator module
	var Generator;
	try {
		Generator = require(module);
	}
	catch (e) { return cb.log.error(e); }

	generate (Generator, scope, {
		error: function (err) { cb.log.error(err); },
		success: function (output) { cb.log.info('ok!'); },
		notSailsApp: function () { cb.log.error('Not a sails app.'); },
		alreadyExists: function () {
			
			// Log custom message if override is defined
			// if (scope.logStatusOverrides && scope.logStatusOverrides.alreadyExists) {
			// 	return scope.logStatusOverrides.alreadyExists(scope, log);
			// }

			return cb.log.error(scope.globalID + ' already exists!');
		}
	});

};
