/**
 * Module dependencies
 */

var generate = require('./generate')
	, path = require('path')
	, reportback = require('reportback')();



/**
 * Generate module(s)
 *
 * @param  {Object}   scope [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
module.exports = function (scope, cb) {
	cb = cb || {};
	cb = reportback.extend(cb, {
		error: cb.error,
		success: function (output) { cb.log.info('ok!'); },
		notSailsApp: function () { cb.log.error('Not a sails app.'); },
		alreadyExists: function () {
			console.log('1111');
			return cb.error();
		}
	});

	if (!scope.generatorType) {
		return cb.error('Sorry, `scope.generatorType` must be defined.');
	}

	// Use configured module name for this generatorType if applicable.
	var module = (scope.modules && scope.modules[scope.generatorType])
		|| 'sails-generate-' + scope.generatorType;

	var Generator;
	var requirePath;
	var requireError;

	// Try requiring the generator from the rootPath
	if (!Generator) {
		try {
			requirePath = path.resolve(scope.rootPath,'node_modules', module);
			Generator = require(requirePath);
		}
		catch (e1) { requireError = e1; }
	}

	// If that doesn't work, try `require()`ing it from console user's cwd
	if (!Generator) {
		try {
			requirePath = path.resolve(process.cwd(),'node_modules', module);
			Generator = require(asDependencyInRootPath);
		}
		catch (e1) { requireError = e1; }
	}

	// Finally, try to load the generator module from sails-generate's dependencies
	if (!Generator) {
		try {
			Generator = require(module);
		}
		catch (e) { requireError = e; }
	}
	

	if (!Generator) {
		return cb.log.error(requireError);
	}

	generate (Generator, scope, cb);

};
