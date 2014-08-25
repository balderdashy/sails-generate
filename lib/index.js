/**
 * Module dependencies
 */

var generate = require('./generate');
var path = require('path');
var reportback = require('reportback')();
var _ = require('lodash');


/**
 * Generate module(s)
 *
 * @param  {Object}   scope [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
module.exports = function(scope, cb) {
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

  if (!scope.generatorType) {
    return cb.error('Sorry, `scope.generatorType` must be defined.');
  }

  // Use configured module name for this generatorType if applicable.
  var module =
    (scope.modules && scope.modules[scope.generatorType]) ||
    'sails-generate-' + scope.generatorType;

  var Generator;
  var requireError;

  // Strategies for finding the generator. Order *is* important!
  var findGeneratorStrategies = [
    function pathBasedFromCwd() {
      return require(path.resolve(process.cwd(), module));
    },
    function pathBasedFromRootPathNodeModules() {
      return require(path.resolve(scope.rootPath, 'node_modules', module));
    },
    function pathBasedFromCwdNodeModules() {
      return require(path.resolve(process.cwd(), 'node_modules', module));
    },
    function pathBasedFromRootPath() {
      return require(path.resolve(scope.rootPath, module));
    },
    function globalModule() {
      return require(module);
    }
  ];

  _(findGeneratorStrategies).each(function findGenerator(strategy) {
    if (Generator) {
      return;
    }
    try {
      Generator = strategy();
    } catch (ex) {
      requireError = throwIfModuleNotFoundError(ex, module);
    }
  });

  if (!Generator) {
    return cb.log.error("No generator called `" + scope.generatorType + "` found; perhaps you meant `sails generate " + scope.generatorType + "`?");
  }

  generate(Generator, scope, cb);

  function throwIfModuleNotFoundError(e, module) {
    var isModuleNotFoundError = e && e.code === 'MODULE_NOT_FOUND' && e.message.match(new RegExp(module));
    if (!isModuleNotFoundError) {
      cb.log.error('Error in "' + scope.generatorType + '" generator (loaded from ' + module + ')');
      throw e;
    } else return e;
  }

};
