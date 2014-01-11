/**
 * Module dependencies
 * @type {Object}
 */
var util = require('util');
var _ = require('./_');
var async = require('async');
var rootGenerator = require('./rootGenerator');
var rootScope = require('./rootScope');
var TemplateHelper = require('./helpers/template');
// var JSONFileHelper = require('./helpers/template');
// var FolderHelper = require('./helpers/folder');
// var ModuleHelper = require('./helpers/module');


var MAX_HOPS = 100;
var hops = 0;


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
	
	// Iterate through targets
	async.each(Object.keys(Generator.targets), function (relPath, cb) {
		var target = Generator.targets[relPath];

		// Create a new scope object for this target,
		// with references to the important bits of the original.
		var targetScope = {
			options: scope.options,
			modules: scope.modules,
			output: scope.output,
			relPath: relPath
		};
		
		
		// Interpret generator definition
		if (target.exec) {
			return target.exec(targetScope, cb);
		}
		if (target.folder) {
			return FolderHelper(targetScope, cb);
		}
		if (target.template) {
			return TemplateHelper(targetScope, cb);
		}
		if (target.jsonfile) {
			return JSONFileHelper(targetScope, cb);
		}

		if (target.generator) {

			
			// Normalize the subgenerator reference
			var subGeneratorRef;
			if (typeof target.generator === 'string') {
				subGeneratorRef = target.generator;
			}
			else if (typeof target.generator === 'object') {
				subGeneratorRef = Generator.generator.module;
			}
			if (!subGeneratorRef) {
				return cb(new Error('Generator Error: Invalid subgenerator referenced for target "'+ relPath +'"'));
			}

			if (typeof subGeneratorRef === 'string') {
				subGeneratorRef = { module: subGeneratorRef };
			}

			var subGenerator;
			if (!subGeneratorRef.module) {
				subGenerator = subGeneratorRef;
			}
			else {
				// Lookup the generator by name if a `module` was specified
				// (this allows the module for a given generator to be
				//  overridden.)
				subGenerator = targetScope.modules[generator];
			}


			// Now that the generator definition has been resolved,
			// call this method recursively on it, passing along our
			// callback:
			if (++hops > MAX_HOPS) {
				return cb(new Error('MAX_HOPS ('+MAX_HOPS+' exceeded!  There is probably a recursive loop in one of your generators.'));
			}
			return generate(subGenerator, targetScope, cb);
		}

		return cb(new Error('Generator Error: Unrecognized syntax for target "'+relPath+'"'));

	}, sb);

}


module.exports = generate;

