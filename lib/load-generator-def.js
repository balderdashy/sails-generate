/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _  = require('lodash');
var flaverr = require('flaverr');


/**
 * loadGeneratorDef()
 *
 * Attempt to require the specified generator.
 *
 * @required {String} generatorType
 * @required {String} rootPath
 * @optional {Dictionary} modules
 *
 * @returns {Dictionary}
 *          generator definition
 *
 * @throws {Error} If no matching generator could be found
 *         @property {String} code   (=== 'generatorNotFound')
 */

module.exports = function loadGeneratorDef(options) {

  // Sanity checks:
  if (!options.generatorType) { throw new Error('Consistency violation: Sorry, `options.generatorType` must be defined and truthy.'); }
  if (!_.isString(options.generatorType)) { throw new Error('Consistency violation: Sorry, `options.generatorType` must be a string.'); }
  if (!_.isUndefined(options.modules)) {
    if (!_.isObject(options.modules) || _.isArray(options.modules) || _.isFunction(options.modules)) {
      throw new Error('Consistency violation: Invalid `options.modules`:  Should be a dictionary, but instead got: '+util.inspect(options.modules, {depth: null}));
    }
  }

  // Use configured package name in `modules[generatorType]` if one exists.
  var generatorPkgName;
  if (options.modules && !_.isUndefined(options.modules[options.generatorType])) {

    if (!_.isString(options.modules[options.generatorType])) {
      return cb.invalid(new Error('Invalid package/module configured as `options.modules[\''+options.generatorType+'\']`.  Should be a string, but instead got: '+util.inspect(options.modules[options.generatorType], {depth: null})));
    }

    generatorPkgName = options.modules[options.generatorType];

  }
  // Otherwise, infer a package name from the `generatorType` (simply by prefixing
  // it with `sails-generate-`.)
  else {

    generatorPkgName = 'sails-generate-' + options.generatorType;

  }

  // Set up a regexp for use below.
  var CONTAINS_GENERATOR_PKG_NAME_RX = new RegExp(_.escapeRegExp(generatorPkgName));

  // Attempt to require the generator definition in the following ways:
  // > (in descending order of priority)
  var requiresToAttempt = [
    generatorPkgName, // package name (normal `require()`, from sails-generate's own dependencies and any global deps installed in `${HOME}`)
    path.resolve(process.cwd(), generatorPkgName),// package name resolved from `${CWD}`
    path.resolve(options.rootPath, 'node_modules', generatorPkgName),// package name resolved from `<<rootPath>>/node_modules/`
    path.resolve(process.cwd(), 'node_modules', generatorPkgName),// package name resolved from `${CWD}/node_modules/`
    path.resolve(options.rootPath || process.cwd(), generatorPkgName),// package name resolved from `${CWD}` (i.e. to allow for relative paths)
  ];

  // A local variable to hold the generator definition that we're trying to load
  // in a few different ways below.
  var generatorDef;

  // This outer try/catch is here to handle unexpected require errors along the way.
  try {

    // Attempt each require, in order, until either:
    // A) it is successful
    // B) we run into an unexpected error, or
    // C) we run out of things to try
    //
    // > Note that we only use `_.any()` so that we can break out of the loop.
    _.any(requiresToAttempt, function (requireToAttempt){

      try {
        generatorDef = require(requireToAttempt);

        // If we made it here, we must have found it and been able to successfully require it.

        // Check that it is valid (and if not, throw an error to jump to our `catch` below)
        if (!_.isPlainObject(generatorDef)) {
          throw new Error('Invalid generator definition: Should be a dictionary, but instead got: '+util.inspect(generatorDef, {depth: null}));
        }

        // Otherwise, it's probably good to go!
        // So now we can return `true`, which will result in us breaking out of this loop.
        return true;
      }
      catch (e) {

        var isRelevantModuleNotFoundError = (
          e.code === 'MODULE_NOT_FOUND' &&
          e.message.match(CONTAINS_GENERATOR_PKG_NAME_RX)
        );

        // If this is a relevant MODULE_NOT_FOUND error, then we'll ignore it
        // and keep trying (i.e. continuing to the next iteration of our loop).
        if (isRelevantModuleNotFoundError) {
          return;
        }//-•

        // Otherwise, this is some misc. unrecognized error-- so in that case, we'll attach an
        // `attemptedRequire` prop for convenience, then throw again to jump to the outer `catch` below.
        e.attemptedRequire = requireToAttempt;
        throw e;

      }//</catch : MODULE_NOT_FOUND error>

    });//</_.any>

  }//</try :: require generator from somewhere maybe>
  catch (e) {

    // Handle unexpected error by logging, then bailing with a fatal errror.
    var unexpectedRequireErrMsg = (function _buildErrorMsg(){

      var appropriatePreposition;
      if (path.isAbsolute(e.attemptedRequire)) {
        appropriatePreposition = 'from';
      }
      else {
        appropriatePreposition = 'as';
      }

      return 'Encountered unexpected error when loading "'+options.generatorType+'" generator '+appropriatePreposition + ' `'+e.attemptedRequire+'`.';
    })();//</self-calling convenience function :: build error msg>
    throw new Error(unexpectedRequireErrMsg+'\nDetails: '+e.stack);

  }//</catch>-•

  // If we could not locate a generator of this type, then log a message and bail.
  if (!generatorDef) {
    throw flaverr('generatorNotFound', new Error('No generator called `' + options.generatorType + '` found; perhaps you meant `sails generate api ' + options.generatorType + '`?'));
  }//-•

  // Return the generator definition.
  return generatorDef;

};
