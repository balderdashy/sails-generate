/**
 * Module dependencies
 * @type {Object}
 */
var _ = require('./_');
var BaseGenerator = require('./BaseGenerator');
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
function runGenerator (Generator, scope, sb) {

	// Validate arguments
	// TODO: validate args more thoroughly
	scope = scope || {};
	scope.options = scope.options || {};
	scope.modules = scope.modules || {};

	// Resolve string shorthand for generator defs
	// to `{ generator: 'originalDef' }`
	if (typeof Generator === 'string') {
		Generator = { generator: Generator };
	}

	_.defaultsDeep(Generator, BaseGenerator);
	

	// Interpret generator definition
	if (Generator.folder) {
		return FolderHelper(scope, sb);
	}
	if (Generator.template) {
		return TemplateHelper(scope, sb);
	}
	if (Generator.jsonfile) {
		return JSONFileHelper(scope, sb);
	}

	if (Generator.generator) {
		
		// Normalize the subgenerator reference
		var subGeneratorRef;
		if (typeof Generator.generator === 'string') {
			subGeneratorRef = Generator.generator;
		}
		else if (typeof Generator.generator === 'object') {
			subGeneratorRef = Generator.generator.module;
		}
		if (!subGeneratorRef) {
			return sb(new Error('Invalid generator referenced in: '+ Generator));
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
			subGenerator = scope.modules[generator];
		}


		// Now that the generator definition has been resolved,
		// call this method recursively on it, passing along our
		// callback:
		if (++hops > MAX_HOPS) {
			return sb(new Error('MAX_HOPS ('+MAX_HOPS+' exceeded!  There is probably a recursive loop in one of your generators.'));
		}
		runGenerator(subGenerator, scope, sb);
	}
}


module.exports = runGenerator;


// module.exports('foo', {

// }, console.log);
