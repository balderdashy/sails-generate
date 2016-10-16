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
 * Known builtins.
 * @type {Array}
 */
var KNOWN_BUILTINS = ['exec', 'folder', 'template', 'jsonfile', 'file', 'copy'];


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
  var scope = options.scope;
  var parentGenerator = options.parent;
  var helpGenerateRecursive = options.recursiveGenerate;

  // This local var (`target`) will be used to hold our final, resolved target.
  var target = options.target;

  // Prevent ∞ recursion.
  var MAX_RESOLVES = 5;
  var _resolves = 0;
  var didReachMaxResolves;

  // Begin a whilst loop.
  async.until(
    //   ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗
    //  ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝
    //  ██║     ███████║█████╗  ██║     █████╔╝
    //  ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗
    //  ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗
    //   ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝
    //
    function check() {

      // Check if this target is valid.
      var isThisTargetValid;
      if (!_.isObject(target)) {
        isThisTargetValid = false;
      }
      else {
        var isTargetPointedAtBuiltin = _.intersection(_.keys(target), KNOWN_BUILTINS).length > 0;
        var isTargetAGeneratorPrbly = _.isObject(target.targets);
        if (!isTargetPointedAtBuiltin && !isTargetAGeneratorPrbly) {
          isThisTargetValid = false;
        }
        else {
          isThisTargetValid = true;
        }
      }

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
    //  ██╗████████╗███████╗██████╗  █████╗ ████████╗███████╗███████╗
    //  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝
    //  ██║   ██║   █████╗  ██████╔╝███████║   ██║   █████╗  █████╗
    //  ██║   ██║   ██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝  ██╔══╝
    //  ██║   ██║   ███████╗██║  ██║██║  ██║   ██║   ███████╗███████╗
    //  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝
    //
    function iteratee(proceed) {

      // Try to parse the target.

      // If the target is a string, interpret it as the name of an overridable generator,
      // so expand it into a dictionary accordingly.
      if (_.isString(target)) {
        target = {
          overridable: target,
          generator: target
        };
      }//>-


      // If this target declares itself overridable, then try to load the package for it.
      // (If we find one, we'll use that instead of whatever was configured.)
      if (target.overridable) {

        // Check that `overridable` syntax is valid.
        if (!_.isString(target.overridable)) {
          return proceed(new Error('Unrecognized generator syntax in targets: ' + util.inspect(target, {depth: null}) + '  (If specified, `overridable` must be a string: the "generator type" to allow this target to be overridden as.)' ));
        }

        // Try to require the appropriate generator of this type.
        try {

          // If it works, point `target.generator` straight at the generator def.
          target.generator = loadGeneratorDef({
            generatorType: generatorTypeToAttemptToLoad,
            rootPath: scope.rootPath,
            modules: scope.modules
          });

        } catch (e) {
          switch (e.code) {

            // If it could not be loaded, that's ok.
            // (We'll still continue below anyway and just use whatever we have in the target otherwise.)
            case 'generatorNotFound':
              break;

            // If an unexpected fatal error occurred, handle it.
            default:
              return proceed(e);

          }
        }//</catch>

      }//</if :: target.overridable>
      //>-•

      // At this point, if this target could be overridden and we were able
      // to load an override, then we've done so already (and updated our target
      // accordingly.)  And if not, then we haven't.

      // Now, if the target's `generator` is a string, then we know it's addressing a package
      // it expects to be installed. So we'll try to load the appropriate generator package
      // and set it as `target.generator`.
      if (_.isString(target.generator)) {
        try {

          target.generator = loadGeneratorDef({
            generatorType: target.generator,
            rootPath: scope.rootPath,
            modules: scope.modules
          });

        } catch (e) {
          switch (e.code) {

            // If it could not be loaded, give up.
            case 'generatorNotFound':
              // console.log('DEBUG:::SUB-GENERATOR NOT FOUND',e);
              return proceed(e);

            // If an unexpected fatal error occurred, handle it.
            default:
              return proceed(e);

          }
        }//</catch>
      }//>-•


      // Determine if the target is pointed at a builtin.
      var isTargetPointedAtBuiltin = _.intersection(_.keys(target), KNOWN_BUILTINS).length > 0;

      // If target is pointed at a builtin, then bail now.
      // (we can use the target exactly as-is)
      if (isTargetPointedAtBuiltin) {
        return proceed();
      }//-•


      //--•
      // IWMIH, then we can assume that this target is referencing a generator (or at least trying to).
      // That means we can expect `target.generator` to be present, and to be a valid inline generator
      // definition.

      // Verify that the `generator` of our target is now a dictionary, like it should be.
      if (!_.isPlainObject(target.generator)) {
        return proceed(new Error('Generator error: Invalid sub-generator configuration for target "' + scope.rootPath + '".'));
      }

      // Otherwise, the target's `generator` is a dictionary, so we'll treat it as an inline
      // sub-generator definition.



      // Otherwise, in order for this target to be useable, it must point to a valid generator.
      // But if it does not have a `generator` property, then we KNOW this is not possible.
      // So give up w/ an error.
      if (!target.generator) {
        return proceed(
          new Error(
            'Unrecognized generator syntax in `targets["' + scope.keyPath + '"]` ::\n' +
            util.inspect(target, {depth: null})
          )
        );
      }//-•


      //--•
      // IWMIH, then we know that `target.generator` is present, meaning that this target
      // is referencing a generator (or at least trying to.)

      // Depending on the situation here, we might attempt to load a generator definition
      // from an installed package below.  If so, we'll use this local variable to hold
      // the "generator type" (a string).
      var generatorTypeToAttemptToLoad;

      // If the target's `generator` is a string, then we know it's addressing a package
      // it expects to be installed. (We'll try to load the appropriate generator package
      // momentarily, below.)
      if (_.isString(target.generator)) {
        generatorTypeToAttemptToLoad = target.generator;
      }
      // But if the target's `generator` is a dictionary, then we'll treat it as an inline
      // sub-generator definition.  (We may still attempt to load an external package though,
      // depending on whether or not the target set the `overridable` prop.)
      else if (_.isPlainObject(target.generator)) {

        // If this target DOES NOT declare itself overridable, then we'll use the target's
        // inline generator definition and bail now.
        if (!target.overridable) {
          target = target.generator;
          return proceed();
        }//-•

        // Check that `overridable` syntax is valid.
        if (!_.isString(target.overridable)) {
          return proceed(new Error('Unrecognized generator syntax in targets: ' + util.inspect(target, {depth: null}) + '  (If specified, `overridable` must be a string: the "generator type" to allow this target to be overridden as.)' ));
        }

        // But otherwise, this target declares itself overridable, so we'll attempt
        // to load a generator package using the target's self-proclaimed "generator type".
        // If that doesn't work, we'll still fall back to using the target's inline generator
        // definition.
        generatorTypeToAttemptToLoad = target.overridablegeneratorType;
        // (TODO)

      } else { return proceed(new Error('Generator error: Invalid sub-generator configuration for target "' + scope.rootPath + '".')); }
      // >-•

      // Try to require the appropriate generator of this type and point
      // the target straight at it.
      var generatorDef;
      try {

        generatorDef = loadGeneratorDef({
          generatorType: generatorTypeToAttemptToLoad,
          rootPath: scope.rootPath,
          modules: scope.modules
        });

      } catch (e) {
        switch (e.code) {

          // If it could not be loaded, give up.
          case 'generatorNotFound':
            console.log('DEBUG:::SUB-GENERATOR NOT FOUND');
            return proceed(e);

          // If an unexpected fatal error occurred, handle it.
          default:
            return proceed(e);

        }
      }//</catch>
      //--•

      // If generator
      if (generatorTypeToAttemptToLoad) {

      }

      // IWMIH, we found our generator.
      // So let's set it as our target and then continue.
      target = generatorDef;
      return proceed();

      // ========================================================================================
      // ========================================================================================
      // <THE OLD WAY>
      // ========================================================================================
      // ========================================================================================
      // So we'll now attempt to determine the target's intent by grabbing
      // a normalized version of it, if necessary.
      // var normalizedTarget;
      // if (_.isString(target.generator)) {
      //   normalizedTarget = {
      //     module: target.generator
      //   };
      // }
      // else if (_.isObject(target.generator)) {
      //   // (currently this includes arrays... and functions... TODO: improve usability here)
      //   normalizedTarget = target.generator;
      // }

      // // If we could not determine a normalized target, then bail w/ an error.
      // if (!normalizedTarget) {
      //   return proceed(new Error('Generator error: Invalid subgenerator referenced for target "' + scope.rootPath + '"'));
      // }//-•

      // // If the normalized target does not have a truthy `.module` property, then we'll
      // // treat this target as an inline sub-generator definition and use it as our final,
      // // normalized target (and then go ahead and bail).
      // if (!normalizedTarget.module) {
      //   target = normalizedTarget;
      //   return proceed();
      // }//-•


      // // IWMIH we've got a solid normalized target to use.
      // // So now, we'll attempt to load the appropriate sub-generator def.
      // // We use this local variable to hold it.
      // var subGenerator;

      // // If the sub-generator reference
      // if (_.isString(normalizedTarget.module)) {

      //   // Lookup the generator by name if a `module` was specified
      //   // (this allows the module for a given generator to be
      //   //  overridden.)
      //   var configuredReference = scope.modules && scope.modules[normalizedTarget.module];

      //   // Refers to a configured module (e.g. in the .sailsrc file), so bail
      //   // and use that configured reference as our target.
      //   if (configuredReference) {
      //     target = configuredReference;
      //     return proceed();
      //   }//-•

      //   // Else if this generator type is explicitly set to `false`,
      //   // disable the generator by using a noop generator.
      //   if (configuredReference === false) {
      //     target = {
      //       before: function(scope, cb) { return cb(); },
      //       targets: {}
      //     };
      //     return proceed();
      //   }//-•

      //   // Otherwise, `configuredReference` is falsey, but not false (i.e. so probably undefined),
      //   // so in that case continue on and try to require the module.
      //   // ||
      //   // \/
      // }//>-•

      // // At this point, normalizedTarget.module should be a string,
      // // and the best guess at the generator module we're going
      // // to get.
      // var module = normalizedTarget.module;
      // var requireError;

      // // Try requiring it directly as a path
      // try {
      //   subGenerator = require(module);
      // } catch (e0) {
      //   requireError = e0;
      // }

      // // Try the scope's rootPath
      // if (!subGenerator) {
      //   try {
      //     var asDependencyInRootPath = path.resolve(scope.rootPath, 'node_modules', module);
      //     subGenerator = require(asDependencyInRootPath);
      //   } catch (e1) {
      //     requireError = e1;
      //   }
      // }

      // // Try the current working directory
      // if (!subGenerator) {
      //   try {
      //     subGenerator = require(path.resolve(process.cwd(), 'node_modules', module));
      //   } catch (e1) {
      //     requireError = e1;
      //   }
      // }


      // // If we couldn't find a generator using the configured module,
      // // try requiring "sails-generate-<module>" to get the core generator
      // // from the dependencies of _this_ package (i.e. deps of `sails-generate` itself)
      // if (!subGenerator && !module.match(/^sails-generate-/)) {
      //   try {
      //     subGenerator = require('sails-generate-' + module);
      //   } catch (e1) {
      //     // Ok, we give up.
      //     requireError = e1;
      //   }
      // }//>-


      // // If we were able to find a usable generator def, send it back and bail.
      // if (subGenerator) {
      //   target = subGenerator;
      //   return proceed();
      // }//-•


      // // But if we still can't find it, give up.
      // return proceed(
      //   new Error(
      //     'Generator Error: Failed to load "' + normalizedTarget.module + '"...' +
      //     (requireError ? ' (' + requireError + ')' : '')
      //   )
      // );

      // ========================================================================================
      // ========================================================================================
      // </THE OLD WAY>
      // ========================================================================================
      // ========================================================================================

    },
    //   █████╗ ███████╗████████╗███████╗██████╗
    //  ██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
    //  ███████║█████╗     ██║   █████╗  ██████╔╝
    //  ██╔══██║██╔══╝     ██║   ██╔══╝  ██╔══██╗
    //  ██║  ██║██║        ██║   ███████╗██║  ██║
    //  ╚═╝  ╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝
    //
    //  ██████╗ ███████╗███████╗ ██████╗ ██╗    ██╗   ██╗██╗███╗   ██╗ ██████╗
    //  ██╔══██╗██╔════╝██╔════╝██╔═══██╗██║    ██║   ██║██║████╗  ██║██╔════╝
    //  ██████╔╝█████╗  ███████╗██║   ██║██║    ██║   ██║██║██╔██╗ ██║██║  ███╗
    //  ██╔══██╗██╔══╝  ╚════██║██║   ██║██║    ╚██╗ ██╔╝██║██║╚██╗██║██║   ██║
    //  ██║  ██║███████╗███████║╚██████╔╝███████╗╚████╔╝ ██║██║ ╚████║╚██████╔╝██╗██╗██╗
    //  ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝ ╚═══╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝╚═╝
    //
    function afterwards(err) {
      if (err) { return done(err); }

      if (didReachMaxResolves) {
        return done(new Error('Generator error: Could not resolve target "' + scope.rootPath + '" due to a recursive loop.  (Exceeded maximum of '+MAX_RESOLVES+' tries.)'));
      }

      // Pass down parent Generator's template directory abs path.
      // (This can still be overridden by this target's definition below.)
      scope.templatesDirectory = parentGenerator.templatesDirectory;

      // Interpret generator definition:
      // (note that `scope` is mutated!)


      //  ╔═╗═╗ ╦╔═╗╔═╗
      //  ║╣ ╔╩╦╝║╣ ║
      //  ╚═╝╩ ╚═╚═╝╚═╝
      if (_.isFunction(target.exec)) {
        target.exec(scope, done);
        return;
      }//-•

      if (!_.isUndefined(target.exec)){ return done(new Error('Invalid target syntax: `exec` must be specified as a function.')); }


      //  ╔═╗╔═╗╔═╗╦ ╦
      //  ║  ║ ║╠═╝╚╦╝
      //  ╚═╝╚═╝╩   ╩
      if (_.isString(target.copy)) {
        _.extend(scope, { templatePath: target.copy });
        generateFileCopy(scope, done);
        return;
      }//-•

      if (_.isPlainObject(target.copy)) {
        _.merge(scope, target.copy);
        generateFileCopy(scope, done);
        return;
      }//-•

      if (!_.isUndefined(target.copy)) { return done(new Error('Invalid target syntax: `copy` must be specified as a dictionary or a string.')); }//-•


      //  ╔═╗╔═╗╦  ╔╦╗╔═╗╦═╗
      //  ╠╣ ║ ║║   ║║║╣ ╠╦╝
      //  ╚  ╚═╝╩═╝═╩╝╚═╝╩╚═
      if (target.folder) {
        _.merge(scope, target.folder);
        generateFolder(scope, done);
        return;
      }//-•

      if (!_.isUndefined(target.folder)) { return done(new Error('Invalid target syntax: `folder` must be specified as a dictionary.')); }//-•


      //  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗
      //   ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣
      //   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝
      if (_.isString(target.template)) {
        _.extend(scope, { templatePath: target.template });
        generateFileFromTemplate(scope, done);
        return;
      }//-•

      if (_.isPlainObject(target.template)) {
        _.merge(scope, target.template);
        generateFileFromTemplate(scope, done);
        return;
      }//-•

      if (!_.isUndefined(target.template)) { return done(new Error('Invalid target syntax: `template` must be specified as a dictionary or a string.')); }//-•


      //   ╦╔═╗╔═╗╔╗╔╔═╗╦╦  ╔═╗
      //   ║╚═╗║ ║║║║╠╣ ║║  ║╣
      //  ╚╝╚═╝╚═╝╝╚╝╚  ╩╩═╝╚═╝
      if (_.isFunction(target.jsonfile)) {
        var jsonDataToUse = target.jsonfile(scope);
        _.extend(scope, { data: jsonDataToUse });
        generateJsonFile(scope, done);
        return;
      }//-•

      if (_.isPlainObject(target.jsonfile)) {
        _.merge(scope, target.jsonfile);
        generateJsonFile(scope, done);
        return;
      }//-•

      if (!_.isUndefined(target.jsonfile)) { return done(new Error('Invalid target syntax: `jsonfile` must be specified as a dictionary or a function.')); }//-•


      //  ╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔╦╗╦ ╦╔═╗╦═╗  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗╦═╗
      //  ╚═╗║ ║║║║║╣   ║ ║ ║ ╠═╣║╣ ╠╦╝  ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║ ║╠╦╝
      //  ╚═╝╚═╝╩ ╩╚═╝  ╚═╝ ╩ ╩ ╩╚═╝╩╚═  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝╩╚═
      // If we made it here, this must be a recursive generator.
      // So real quick, check to make sure maxHops has not been exceeded.
      if (++scope._depth > scope.maxHops) {
        return done(new Error('`maxHops` (' + scope.maxHops + ' exceeded!  There is probably a recursive loop in one of your generators.'));
      }//-•

      // And now that the generator target has been resolved,
      // call this method recursively on it, passing along our
      // callback:
      helpGenerateRecursive(target, scope, done);

    }//</async.until() --> afterwards>
  ); //</ async.until >//
};

