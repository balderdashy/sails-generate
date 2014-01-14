/**
 * Module dependencies
 * @type {Object}
 */
var util = require('util');
var _ = require('lodash');
var async = require('async');
var switchback = require('node-switchback');

var generate = require('./generate');
var FolderHelper = require('./helpers/folder');
var TemplateHelper = require('./helpers/template');
var JSONFileHelper = require('./helpers/jsonfile');
var CopyHelper = require('./helpers/copy');

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
			return cb(new Error('Generator Error: Could not resolve target "'+scope.rootPath+'" (probably a recursive loop)'));
		}
		
		// Interpret generator definition
		if (target.exec) {
			return target.exec(scope, cb);
		}
		if (target.copy) {
			scope = mergeSubtargetScope(scope,typeof target.copy === 'string' ? {templatePath: target.copy} : target.copy); 
			return CopyHelper(scope, cb);
		}
		if (target.folder) {
			scope = mergeSubtargetScope(scope, target.folder);
			return FolderHelper(scope, cb);
		}
		if (target.template) {
			scope = mergeSubtargetScope(scope,typeof target.template === 'string' ? {templatePath: target.template} : target.template); 
			return TemplateHelper(scope, function (err) {
				if (err) {
					if (err.path) return cb('Cannot find specified template @ `'+e.path+'`');
					return cb(err);
				}
				return TemplateHelper(scope, cb);
			});
		}
		if (target.jsonfile) {
			if (typeof target.jsonfile === 'object') {
				scope = mergeSubtargetScope(scope, target.jsonfile);
			}
			else if (typeof target.jsonfile === 'function') {
				scope = _.merge(scope, {
					data: target.jsonfile(scope)
				});
			}
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
 * @param  {[type]} scope     [description]
 * @param  {[type]} subtarget [description]
 * @return {[type]}           [description]
 */
function mergeSubtargetScope (scope, subtarget) {
	return _.merge(scope, _.isObject(subtarget) ? subtarget : {});
}


/**
 * Known helpers
 * @type {Array}
 */
var KNOWN_HELPERS = ['exec', 'folder', 'template', 'jsonfile', 'file', 'copy'];
function targetIsHelper (target) {
	return _.some(target, function (subTarget, key) {
		return _.contains(KNOWN_HELPERS,key);
	});
}


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
	if (targetIsHelper(target)) {
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
			return cb(new Error('Generator Error: Invalid subgenerator referenced for target "'+ scope.rootPath +'"'));
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

	return cb( new Error(
		'Unrecognized generator syntax in `targets["'+scope.keyPath+'"]` ::\n'+
		util.inspect(target))
	);
}



/**
 * 
 * @param  {[type]}  target [description]
 * @return {Boolean}        [description]
 */
function isValidTarget (target) {
	var ok = true;

	ok = ok && typeof target === 'object';
	
	// Is using a helper
	// Or is another generator def.
	ok = ok && ( targetIsHelper(target) || _.has(target, 'targets') );

	return ok;
}
