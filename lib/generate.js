/**
 * Module dependencies
 * @type {Object}
 */
var util = require('util');
var _ = require('./_');
var async = require('async');
var path = require('path');


var rootGenerator = require('./rootGenerator');
var rootScope = require('./rootScope');
var generateTarget = require('./target');


/**
 * Run a generator given an existing scope.
 * 
 * @param  {Object} Generator
 * @param  {Object} scope
 * @param  {Switchback} sb
 */
function generate (Generator, scope, sb) {

	// TODO: validate args more thoroughly

	// Merge with root scope
	_.defaultsDeep(scope, rootScope);

	// Resolve string shorthand for generator defs
	// to `{ generator: 'originalDef' }`
	if (typeof Generator === 'string') {
		Generator = { generator: Generator };
	}

	// Merge with root generator
	_.defaultsDeep(Generator, rootGenerator);

	// Run the generator's bootstrap before proceeding
	Generator.bootstrap(scope, function (err) {
		if (err) return sb(err);

		// Process all of the generator's targets concurrently
		async.each(Object.keys(Generator.targets), function (relPath, cb) {

			// Create a new scope object for this target,
			// with references to the important bits of the original.
			// (depth will be passed-by-value, but that's what we want)
			// 
			// Then generate the target, passing along a reference to
			// the base `generate` method to allow for recursive generators.
			var target = Generator.targets[relPath];
			if (!target) return cb(new Error('Generator error: Invalid target: {"'+relPath+'": '+util.inspect(target)+'}'));


			// Resolve relPath with current relPath in scope.
			// If no relPath exists in scope, assume we're operating
			// from the rootPath.
			var startFrom = scope.relPath || scope.rootPath;
			relPath = path.resolve(startFrom, relPath);


			generateTarget({
				target: target,
				scope: _.merge(scope, {
					relPath: relPath
				}),
				recursiveGenerate: generate,
				cb: cb
			});

		}, sb);
	});
}


module.exports = generate;
