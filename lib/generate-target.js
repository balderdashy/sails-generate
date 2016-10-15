/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var reportback = require('reportback')();

var generateFolder = require('./builtins/folder');
var generateFileFromTemplate = require('./builtins/template');
var generateJsonFile = require('./builtins/jsonfile');
var generateFileCopy = require('./builtins/copy');



/**
 * generateTarget()
 *
 * @param  {Dictionary}  options
 *     @property {String|Dictionary} target
 *     @property {Dictionary} scope
 *     @property {Dictionary} parentGenerator
 *         @property {String} templatesDirectory
 *     @property {Function} recursiveGenerate
 *
 * @param  {Function}  done
 */

module.exports = function generateTarget(options, done) {

  // Ensure `done` is a reportback, for consistency.
  // (This will likely be removed in a future version Sails.)
  done = reportback.extend(done);

  // Options
  var target = options.target;
  var scope = options.scope;
  var parentGenerator = options.parent;
  var helpGenerateRecursive = options.recursiveGenerate;


  var MAX_RESOLVES = 5;
  var _resolves = 0;

  async.until(
    function check() {
      // Check if the target is valid yet.
      // (and increment the counter otherwise, giving up if we've reached MAX_RESOLVES)
      return isValidTarget(target) || (++_resolves > MAX_RESOLVES);
    },
    function iteratee(done) {

      // Try to parse the target.
      parseTarget(target, scope, function (err, resolvedTarget) {
        if (err) { return done(err); }

        target = resolvedTarget;

        return done();

      });

    },
    function afterwards(err) {
      if (err) { return done(err); }

      if (!isValidTarget(target)) {
        return done(new Error('Generator Error: Could not resolve target "' + scope.rootPath + '" (probably a recursive loop)'));
      }

      // Pass down parent Generator's template directory abs path
      scope.templatesDirectory = parentGenerator.templatesDirectory;

      // Interpret generator definition
      if (target.exec) {
        return target.exec(scope, done);
      }
      if (target.copy) {
        scope = mergeSubtargetScope(scope, typeof target.copy === 'string' ? {
          templatePath: target.copy
        } : target.copy);
        return generateFileCopy(scope, done);
      }
      if (target.folder) {
        scope = mergeSubtargetScope(scope, target.folder);
        return generateFolder(scope, done);
      }
      if (target.template) {
        scope = mergeSubtargetScope(scope, typeof target.template === 'string' ? {
          templatePath: target.template
        } : target.template);

        return generateFileFromTemplate(scope, done);
      }
      if (target.jsonfile) {
        if (_.isObject(target.jsonfile)) {
          scope = mergeSubtargetScope(scope, target.jsonfile);
        } else if (_.isFunction(target.jsonfile)) {
          scope = _.merge(scope, {
            data: target.jsonfile(scope)
          });
        }
        return generateJsonFile(scope, done);
      }

      // If we made it here, this must be a recursive generator:

      // So real quick, check to make sure maxHops has not been exceeded.
      if (++scope._depth > scope.maxHops) {
        return done(new Error('`maxHops` (' + scope.maxHops + ' exceeded!  There is probably a recursive loop in one of your generators.'));
      }

      // And now that the generator target has been resolved,
      // call this method recursively on it, passing along our
      // callback:
      helpGenerateRecursive(target, scope, done);

    }
  ); //</ async.until >//
};



/**
 * @param  {[type]} scope     [description]
 * @param  {[type]} subtarget [description]
 * @return {[type]}           [description]
 */
function mergeSubtargetScope(scope, subtarget) {
  return _.merge(scope, _.isObject(subtarget) ? subtarget : {});
}


/**
 * Known builtins
 * @type {Array}
 */
var KNOWN_BUILTINS = ['exec', 'folder', 'template', 'jsonfile', 'file', 'copy'];

function getIsTargetPointedAtBuiltin(target) {
  return _.some(target, function(subTarget, key) {
    return _.contains(KNOWN_BUILTINS, key);
  });
}


/**
 * parseTarget()
 *
 * @param  {String|Dictionary}   target
 * @param  {Dictionary}          scope
 * @param  {Function} cb
 */
function parseTarget(target, scope, cb) {

  if (typeof target === 'string') {
    target = {
      generator: target
    };
  }

  // Interpret generator definition
  if (getIsTargetPointedAtBuiltin(target)) {
    return cb(undefined, target);
  }

  if (target.generator) {

    // Normalize the subgenerator reference
    var subGeneratorRef;
    if (_.isString(target.generator)) {
      subGeneratorRef = {
        module: target.generator
      };
    }
    else if (_.isObject(target.generator)) {
      subGeneratorRef = target.generator;
    }
    // (what about array? function? TODO: improve usability here)


    if (!subGeneratorRef) {
      return cb(new Error('Generator error: Invalid subgenerator referenced for target "' + scope.rootPath + '"'));
    }

    // Now normalize the sub-generator
    var subGenerator;

    // No `module` means we'll treat this subgenerator as an inline generator definition.
    if (!subGeneratorRef.module) {
      subGenerator = subGeneratorRef;
      if (subGenerator) {
        return cb(undefined, subGenerator);
      }
    }//>-•


    //
    // Otherwise, IWMIH, we'll attempt to load this subgenerator.
    //

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // TODO: use loadGeneratorDef helper
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    if (_.isString(subGeneratorRef.module)) {

      // Lookup the generator by name if a `module` was specified
      // (this allows the module for a given generator to be
      //  overridden.)
      var configuredReference = scope.modules && scope.modules[subGeneratorRef.module];

      // Refers to a configured module (i.e. sailsrc or comparable)
      // so keep going.
      if (configuredReference) {
        return cb(undefined, configuredReference);
      }

      // If this generator type is explicitly set to `false`,
      // disable the generator by using a noop generator.
      else if (configuredReference === false) {
        var NOOP_GENERATOR = {
          before: function(scope, cb) { return cb(); },
          targets: {}
        };
        return cb(undefined, NOOP_GENERATOR);
      }

      // If `configuredReference` is undefined, continue on
      // and try to require the module.
      //
      // ||
      // \/
    }//>-

    // At this point, subGeneratorRef.module should be a string,
    // and the best guess at the generator module we're going
    // to get.
    var module = subGeneratorRef.module;
    var requireError;

    // Try requiring it directly as a path
    try {
      subGenerator = require(module);
    } catch (e0) {
      requireError = e0;
    }

    // Try the scope's rootPath
    if (!subGenerator) {
      try {
        var asDependencyInRootPath = path.resolve(scope.rootPath, 'node_modules', module);
        subGenerator = require(asDependencyInRootPath);
      } catch (e1) {
        requireError = e1;
      }
    }

    // Try the current working directory
    if (!subGenerator) {
      try {
        subGenerator = require(path.resolve(process.cwd(), 'node_modules', module));
      } catch (e1) {
        requireError = e1;
      }
    }


    // If we couldn't find a generator using the configured module,
    // try requiring "sails-generate-<module>" to get the core generator
    // from the dependencies of _this_ package (i.e. deps of `sails-generate` itself)
    if (!subGenerator && !module.match(/^sails-generate-/)) {
      try {
        subGenerator = require('sails-generate-' + module);
      }

      // Ok, we give up.
      catch (e1) {
        requireError = e1;
      }
    }


    // If we were able to find it, send it back and bail.
    if (subGenerator) {
      return cb(undefined, subGenerator);
    }


    // But if we still can't find it, give up.

    // FUTURE: look for subGeneratorRef on npm instead? (would need to emit a message to scope.output letting user know what's going on)
    return cb(
      new Error(
        'Generator Error: Failed to load "' + subGeneratorRef.module + '"...' +
        (requireError ? ' (' + requireError + ')' : '')
      )
    );

  }//<if :: target.generator is truthy>

  // --•
  // Otherwise, this is unrecognized syntax, so give up.
  return cb(
    new Error(
      'Unrecognized generator syntax in `targets["' + scope.keyPath + '"]` ::\n' +
      util.inspect(target, {depth: null})
    )
  );

}//</fn definition :: parseTarget>



/**
 *
 * @param  {[type]}  target [description]
 * @return {Boolean}        [description]
 */
function isValidTarget(target) {
  var ok = true;

  ok = ok && typeof target === 'object';

  // Is using a helper
  // Or is another generator def.
  ok = ok && (getIsTargetPointedAtBuiltin(target) || _.has(target, 'targets'));

  return ok;
}
