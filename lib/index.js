/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _ = require('lodash');
var reportback = require('reportback')();
var helpGenerate = require('./help-generate');



/**
 * sails-generate
 *
 * Generate files and folders using builtins,
 * or run other generators.
 *
 * @param  {Dictionary} scope
 * @param  {Function} cb
 *         @property {Function} log.info
 *         @property {Function} log.error
 *         @property {Function} error
 *         @property {Function} invalid
 */

module.exports = function sailsGen (scope, cb) {
  cb = cb || {};
  cb = reportback.extend(cb, {
    error: cb.error,
    invalid: cb.invalid,
    success: function(output) {
      cb.log.info('ok!');
    },
    notSailsApp: function() {
      cb.log.error('Not a sails app.');
    },
    alreadyExists: function() {
      return cb.error('Already exists.');
    }
  });

  // `scope.generatorType` is a required string.
  if (!scope.generatorType) {
    return cb.invalid(new Error('Sorry, `scope.generatorType` must be defined and truthy.'));
  }
  if (!_.isString(scope.generatorType)) {
    return cb.invalid(new Error('Sorry, `scope.generatorType` must be a string.'));
  }

  // If specified, `scope.modules` must be a dictionary.
  if (!_.isUndefined(scope.modules)) {
    if (!_.isObject(scope.modules) || _.isArray(scope.modules) || _.isFunction(scope.modules)) {
      return cb.invalid(new Error('Invalid `scope.modules`:  Should be a dictionary, but instead got: '+util.inspect(scope.modules, {depth: null})));
    }
  }

  // Use configured package name in `modules[generatorType]` if one exists.
  var generatorPkgName;
  if (scope.modules && !_.isUndefined(scope.modules[scope.generatorType])) {

    if (!_.isString(scope.modules[scope.generatorType])) {
      return cb.invalid(new Error('Invalid package/module configured as `scope.modules[\''+scope.generatorType+'\']`.  Should be a string, but instead got: '+util.inspect(scope.modules[scope.generatorType], {depth: null})));
    }

    generatorPkgName = scope.modules[scope.generatorType];

  }
  // Otherwise, infer a package name from the `generatorType` (simply by prefixing
  // it with `sails-generate-`.)
  else {

    generatorPkgName = 'sails-generate-' + scope.generatorType;

  }

  // Set up a regexp for use below.
  var CONTAINS_GENERATOR_PKG_NAME_RX = new RegExp(_.escapeRegExp(generatorPkgName));

  // Attempt to require the generator definition in the following ways:
  // > (in descending order of priority)
  var requiresToAttempt = [
    generatorPkgName, // package name (normal `require()`)
    path.resolve(process.cwd(), generatorPkgName),// package name resolved from process.cwd()
    path.resolve(scope.rootPath, 'node_modules', generatorPkgName),// from the rootPath
    path.resolve(process.cwd(), 'node_modules', generatorPkgName),// from console user's cwd
    path.resolve(scope.rootPath || process.cwd(), generatorPkgName),// from sails-generate's dependencies
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

      return 'Encountered unexpected error when loading "'+scope.generatorType+'" generator '+appropriatePreposition + ' `'+e.attemptedRequire+'`.';
    })();//</self-calling convenience function :: build error msg>
    return cb(new Error(unexpectedRequireErrMsg+'\nDetails: '+e.stack));

  }//</catch>-•

  // If we could not locate a generator of this type, then log a message and bail.
  if (!generatorDef) {
    // cb.log.error('No generator called `' + scope.generatorType + '` found; perhaps you meant `sails generate api ' + scope.generatorType + '`?');
    return cb.invalid(new Error('No generator called `' + scope.generatorType + '` found; perhaps you meant `sails generate api ' + scope.generatorType + '`?'));
  }//-•

  // Otherwise, we found our generator.  So now let's use it.
  helpGenerate(generatorDef, scope, cb);

};
