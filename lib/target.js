/**
 * Module dependencies
 * @type {Object}
 */
var util = require('util');
var TemplateHelper = require('./helpers/template');
var generate = require('./generate');

// var JSONFileHelper = require('./helpers/template');
// var FolderHelper = require('./helpers/folder');
// var ModuleHelper = require('./helpers/module');

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


	if (typeof target === 'string') {
		target = { generator: target };
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
			return cb(new Error('Generator Error: Invalid subgenerator referenced for target "'+ scope.relPath +'"'));
		}

		// Now normalize the sub-generator
		var subGenerator;
		if (!subGeneratorRef.module) {
			subGenerator = subGeneratorRef;
		}
		else {
			// Lookup the generator by name if a `module` was specified
			// (this allows the module for a given generator to be
			//  overridden.)
			var configuredReference = scope.modules[subGeneratorRef.module];
			var subGeneratorModuleID = configuredReference || subGeneratorRef.module;

			// At this point, subGeneratorModuleID should be a string,
			// and the best guess at the generator module we're going
			// to get.
			try {
				subGenerator = require(subGeneratorModuleID);
			}
			catch(e) {}
			
			// If we still can't find it, give up
			if (!subGenerator) {
				// TODO: look for subGeneratorRef on npm
				// TODO: emit a message to scope.output letting user know what's going on
				return cb(
					new Error('Generator Error: Failed to load "' + 
					subGeneratorRef.module + '"...' +
					(configuredReference ? ' (unknown module: `'+configuredReference+'`)' : '') +
					'')
				);
			}
		}


		// Now that the generator definition has been resolved,
		// call this method recursively on it, passing along our
		// callback:
		if (++scope._depth > scope.options.maxDepth) {
			return cb(new Error('`maxDepth` ('+maxDepth+' exceeded!  There is probably a recursive loop in one of your generators.'));
		}
		return recursiveGenerate(subGenerator, scope, cb);
	}

	return cb(new Error('Generator Error: Unrecognized syntax for target "'+scope.relPath+'"'));
}

module.exports = generateTarget;
