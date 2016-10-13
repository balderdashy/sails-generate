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
      return cb.error();
    }
  });

  // `scope.generatorType` is a required string.
  if (!scope.generatorType) {
    return cb(new Error('Sorry, `scope.generatorType` must be defined and truthy.'));
  }
  if (!_.isString(scope.generatorType)) {
    return cb(new Error('Sorry, `scope.generatorType` must be a string.'));
  }

  // If specified, `scope.modules` must be a dictionary.
  if (!_.isUndefined(scope.modules)) {
    if (!_.isObject(scope.modules) || _.isArray(scope.modules) || _.isFunction(scope.modules)) {
      return cb(new Error('Invalid `scope.modules`:  Should be a dictionary, but instead got: '+util.inspect(scope.modules, {depth: null})));
    }
  }

  // Use configured module (i.e. package) name in `modules[generatorType]` if one exists.
  // by simply prefixing it with `sails-generate-`.
  var module;
  if (scope.modules && !_.isUndefined(scope.modules[scope.generatorType])) {

    if (!_.isString(scope.modules[scope.generatorType])) {
      return cb(new Error('Invalid package/module configured as `scope.modules[\''+scope.generatorType+'\']`.  Should be a string, but instead got: '+util.inspect(scope.modules[scope.generatorType], {depth: null})));
    }

    module = scope.modules[scope.generatorType];

  }
  // Otherwise, infer a package name from the `generatorType`
  else {

    module = 'sails-generate-' + scope.generatorType;

  }

  // Set up a regexp and precompiled template function for use below.
  var CONTAINS_MODULE_NAME_RX = new RegExp(_.escapeRegExp(module));
  var LOG_MSG_TPLFN = _.template(
    'Encountered unexpected error when loading "'+scope.generatorType+'" generator '+
    '<% if (isPath) {%>'+
    'from `<%=attemptedRequireStr%>`'+
    '<% } '+
    '   else { %>'+
    'as `<%=attemptedRequireStr%>`'+
    '<% } %>'+
    '.'
  );


  // Attempt to require the generator definition in the following ways:
  // > (in descending order of priority)
  var requiresToAttempt = [
    module, // package name (normal `require()`)
    path.resolve(process.cwd(), module),// package name resolved from process.cwd()
    path.resolve(scope.rootPath, 'node_modules', module),// from the rootPath
    path.resolve(process.cwd(), 'node_modules', module),// from console user's cwd
    path.resolve(scope.rootPath || process.cwd(), module),// from sails-generate's dependencies
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
    generatorDef = _.find(requiresToAttempt, function (requireToAttempt){

      try {
        generatorDef = require(requireToAttempt);
        return generatorDef;
      }
      catch (e) {

        var isRelevantModuleNotFoundError = e.code === 'MODULE_NOT_FOUND' && e.message.match(CONTAINS_MODULE_NAME_RX);
        if (!isRelevantModuleNotFoundError) { throw e; }

      }

    });//</_.find>

  } catch (e) {
    // Handle unexpected error:
    cb.log.error(LOG_MSG_TPLFN({
      attemptedRequireStr: module,
      isPath: false
    }));

    throw e;
  }//</catch>




  if (!generatorDef) {
    return cb.log.error('No generator called `' + scope.generatorType + '` found; perhaps you meant `sails generate api ' + scope.generatorType + '`?');
  }

  helpGenerate(generatorDef, scope, cb);

};
