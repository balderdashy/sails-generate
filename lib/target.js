/**
 * Module dependencies
 * @type {Object}
 */
var util = require('util');
var async = require('async');
var TemplateHelper = require('./helpers/template');
var generate = require('./generate');

var JSONFileHelper = require('./helpers/template');
var FolderHelper = require('./helpers/folder');

/**
 * 
 * @param  {Object}   options
 */
function generateTarget (options) {

	// Options
	var target = options.target;
	var scope = options.scope;
	var cb = options.cb;
	var recursiveGenerate = options.recursiveGenerate;

	var MAX_RESOLVES = 5, _resolves = 0;
	async.until(function checkIfTargetIsValidYet () {
		return isValidTarget(target) || (++_resolves > MAX_RESOLVES);
	}, function tryToParseTarget (cb) {
		parseTarget(target, scope, function (err, resolvedTarget) {
			if (err) return cb(err);
			target = resolvedTarget;
			return cb();
		});
	}, function afterwards (err) {
		if (err) return cb(err);
		if ( !isValidTarget(target) ) {
			return cb(new Error('Generator Error: Could not resolve target "'+scope.destPath+'" (probably a recursive loop)'));
		}
		
		// Interpret generator definition
		if (target.exec) {
			return target.exec(scope, cb);
		}
		if (target.folder) {
			return FolderHelper(scope, cb);
		}
		if (target.template) {
			return TemplateHelper(scope, cb);
		}
		if (target.jsonfile) {
			return JSONFileHelper(scope, cb);
		}

		// If we made it here, this must be a recursive generator:

		// Now that the generator definition has been resolved,
		// call this method recursively on it, passing along our
		// callback:
		if (++scope._depth > scope.options.maxDepth) {
			return cb(new Error('`maxDepth` ('+maxDepth+' exceeded!  There is probably a recursive loop in one of your generators.'));
		}
		return recursiveGenerate(target, scope, cb);
	});

}

module.exports = generateTarget;





/**
 * 
 * @param  {[type]}   target      [description]
 * @param  {[type]}   scope [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
function parseTarget (target, scope, cb) {

	if (typeof target === 'string') {
		target = { generator: target };
	}

	// Interpret generator definition
	if (target.exec || target.folder || target.template || target.jsonfile) {
		return cb(null, target);
	}

	if (target.generator) {
		
		// Normalize the subgenerator reference
		var subGeneratorRef;
		if (typeof target.generator === 'string') {
			subGeneratorRef = { module: target.generator };
		}
		else if (typeof target.generator === 'object') {
			subGeneratorRef = target.generator;
		}
		if (!subGeneratorRef) {
			return cb(new Error('Generator Error: Invalid subgenerator referenced for target "'+ scope.destPath +'"'));
		}

		// Now normalize the sub-generator
		var subGenerator;
		if (!subGeneratorRef.module) {
			subGenerator = subGeneratorRef;
		}
		else {

			if (typeof subGeneratorRef.module === 'string') {
				// Lookup the generator by name if a `module` was specified
				// (this allows the module for a given generator to be
				//  overridden.)
				var configuredReference = scope.modules[subGeneratorRef.module];
				if (configuredReference) {
					return cb(null, configuredReference);
				}
			}

			// At this point, subGeneratorRef.module should be a string,
			// and the best guess at the generator module we're going
			// to get.
			var requireError;
			try {
				subGenerator = require(subGeneratorRef.module);
			}
			catch(e) { requireError = e; }
			
			// If we still can't find it, give up
			if (!subGenerator) {
				// TODO: look for subGeneratorRef on npm
				// TODO: emit a message to scope.output letting user know what's going on
				return cb(
					new Error('Generator Error: Failed to load "' + 
					subGeneratorRef.module + '"...' +
					(requireError ? ' ('+requireError+')' : '')+
					'')
				);
			}

			return cb(null, subGenerator);
		}
	}

	return cb(new Error('Generator Error: Unrecognized syntax for target "'+scope.destPath+'"'));
}



/**
 * 
 * @param  {[type]}  target [description]
 * @return {Boolean}        [description]
 */
function isValidTarget (target) {
	var ok = typeof target === 'object';
	
	// Is using a helper
	ok = ok || (target.exec || target.folder || target.template || target.jsonfile);
	
	// Is another generator def.
	ok = ok || target.targets;

	return ok;
}
