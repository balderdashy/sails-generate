/**
 * Module dependencies
 */

var generate = require('./generate')
	, reportback = require('reportback')();



/**
 * Generate module(s)
 *
 * @param  {Object}   scope [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
module.exports = function (scope, cb) {
	cb = reportback.extend(cb);

	if (!scope.generatorType) {
		return cb.error('Sorry, `scope.generatorType` must be defined.');
	}

	// Use configured module name for this generatorType if applicable.
	var module = (scope.modules && scope.modules[scope.generatorType])
		|| 'sails-generate-' + scope.generatorType;

	// Try to load the generator module
	var Generator;
	try {
		Generator = require(module);
	}
	catch (e) { return cb.log.error(e); }

	generate (Generator, scope, {
		error: cb.error,
		success: function (output) { cb.log.info('ok!'); },
		notSailsApp: function () { cb.log.error('Not a sails app.'); },
		alreadyExists: function () {
			console.log('1111');
			return cb.error();
		}
	});

};
