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
 * Generate the specified target using the provided scope.
 * > This module is called from exactly one place: `help-generate.js`
 *
 * @param  {Dictionary}  options
 *     @property {String|Dictionary} target
 *     @property {Dictionary} scope
 *     @property {Dictionary} parentGenerator
 *         @property {String} templatesDirectory
 *     @property {Function} recursiveGenerate
 *               a recursive reference to `helpGenerate()`.
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
  var didReachMaxResolves;

  async.until(
    function check() {

      // Check if this target is valid.
      var isThisTargetValid = (
        _.isObject(target) &&
        (
          getIsTargetPointedAtBuiltin(target) ||
          _.isObject(target.targets)
        )
      );

      // If so, then we're done.
      if (isThisTargetValid) {
        return true;
      }//-•

      // But if it's not, then increment the counter.
      // (And check if we've reached MAX_RESOLVES-- if so, then we'll set
      //  the `didReachMaxResolves` flag, and then stop.)
      _resolves++;
      if (_resolves > MAX_RESOLVES) {
        didReachMaxResolves = true;
        return true;
      }//-•

      // But otherwise, we'll keep trying to parse it.
      return false;
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

      if (didReachMaxResolves) {
        return done(new Error('Generator error: Could not resolve target "' + scope.rootPath + '" due to a recursive loop.  (Exceeded maximum of '+MAX_RESOLVES+' tries.)'));
      }

      // Pass down parent Generator's template directory abs path
      scope.templatesDirectory = parentGenerator.templatesDirectory;

      // Interpret generator definition
      if (target.exec) {
        target.exec(scope, done);
        return;
      }//-•

      if (target.copy) {
        scope = mergeSubtargetScopeBeforeCallingBuiltin(scope, typeof target.copy === 'string' ? {
          templatePath: target.copy
        } : target.copy);
        generateFileCopy(scope, done);
        return;
      }//-•

      if (target.folder) {
        scope = mergeSubtargetScopeBeforeCallingBuiltin(scope, target.folder);
        generateFolder(scope, done);
        return;
      }//-•

      if (target.template) {
        scope = mergeSubtargetScopeBeforeCallingBuiltin(scope, typeof target.template === 'string' ? {
          templatePath: target.template
        } : target.template);

        generateFileFromTemplate(scope, done);
        return;
      }//-•

      if (target.jsonfile) {
        if (_.isArray(target.jsonfile)) {
          return done(new Error('Invalid syntax: `jsonfile` must be specified as a dictionary or a function.'));
        }//-•

        if (_.isFunction(target.jsonfile)) {
          scope = _.merge(scope, {
            data: target.jsonfile(scope)
          });
        }
        else if (_.isObject(target.jsonfile)) {
          scope = mergeSubtargetScopeBeforeCallingBuiltin(scope, target.jsonfile);
        }
        //>-
        generateJsonFile(scope, done);
        return;
      }//-•

      // If we made it here, this must be a recursive generator.
      // So real quick, check to make sure maxHops has not been exceeded.
      if (++scope._depth > scope.maxHops) {
        return done(new Error('`maxHops` (' + scope.maxHops + ' exceeded!  There is probably a recursive loop in one of your generators.'));
      }//-•

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
function mergeSubtargetScopeBeforeCallingBuiltin(scope, subtarget) {
  return _.merge(scope, _.isObject(subtarget) ? subtarget : {});
}


/**
 * Known builtins
 * @type {Array}
 */
var KNOWN_BUILTINS = ['exec', 'folder', 'template', 'jsonfile', 'file', 'copy'];

function getIsTargetPointedAtBuiltin(target) {
  return _.any(target, function(subTarget, key) {
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

  // If target is pointed at a builtin, then bail now.
  // (we can use the target exactly as-is)
  if (getIsTargetPointedAtBuiltin(target)) {
    return cb(undefined, target);
  }//-•



  // Otherwise, in order for this target to be useable, it must point to a valid generator.
  // But if it does not have a `generator` property, then we KNOW this is not possible.
  // So give up w/ an error.
  if (!target.generator) {
    return cb(
      new Error(
        'Unrecognized generator syntax in `targets["' + scope.keyPath + '"]` ::\n' +
        util.inspect(target, {depth: null})
      )
    );
  }//-•


  // IWMIH, then we know that `target.generator` is truthy.
  //
  // So we'll now attempt to determine the target's intent by grabbing a normalized
  // version of it, if necessary.
  var normalizedTarget;
  if (_.isString(target.generator)) {
    normalizedTarget = {
      module: target.generator
    };
  }
  else if (_.isObject(target.generator)) {
    // (currently this includes arrays... and functions... TODO: improve usability here)
    normalizedTarget = target.generator;
  }

  // If we could not determine a normalized target, then bail w/ an error.
  if (!normalizedTarget) {
    return cb(new Error('Generator error: Invalid subgenerator referenced for target "' + scope.rootPath + '"'));
  }//-•

  // If the normalized target does not have a truthy `.module`, then we'll treat this
  // target as an inline sub-generator definition (and go ahead and bail with it).
  if (!normalizedTarget.module) {
    subGenerator = normalizedTarget;
    return cb(undefined, subGenerator);
  }//-•


  // IWMIH we've got a solid normalized target to use.
  // So now, we'll attempt to load the appropriate sub-generator def.
  // We use this local variable to hold it.
  var subGenerator;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TODO: use loadGeneratorDef helper
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the sub-generator reference
  if (_.isString(normalizedTarget.module)) {

    // Lookup the generator by name if a `module` was specified
    // (this allows the module for a given generator to be
    //  overridden.)
    var configuredReference = scope.modules && scope.modules[normalizedTarget.module];

    // Refers to a configured module (e.g. in the .sailsrc file), so bail
    // and use that configured configured reference.
    if (configuredReference) {
      return cb(undefined, configuredReference);
    }
    //
    // Else if this generator type is explicitly set to `false`,
    // disable the generator by using a noop generator.
    else if (configuredReference === false) {
      return cb(undefined, {
        before: function(scope, cb) { return cb(); },
        targets: {}
      });
    }

    // Otherwise, `configuredReference` is falsey, but not false (i.e. so probably undefined),
    // so in that case continue on and try to require the module.
    // ||
    // \/
  }//>-•

  // At this point, normalizedTarget.module should be a string,
  // and the best guess at the generator module we're going
  // to get.
  var module = normalizedTarget.module;
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
    } catch (e1) {
      // Ok, we give up.
      requireError = e1;
    }
  }//>-


  // If we were able to find a usable generator def, send it back and bail.
  if (subGenerator) {
    return cb(undefined, subGenerator);
  }//-•


  // But if we still can't find it, give up.
  return cb(
    new Error(
      'Generator Error: Failed to load "' + normalizedTarget.module + '"...' +
      (requireError ? ' (' + requireError + ')' : '')
    )
  );

}//</fn definition :: parseTarget>


