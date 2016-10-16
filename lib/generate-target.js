/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var reportback = require('reportback')();

var loadGeneratorDef = require('./load-generator-def');
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

  // Inherit the `templatesDirectory` from the parent Generator's template directory.
  // (But only if there is one... otherwise just keep whatever's already on the scope.)
  //
  // > Notes:
  // > + This is always an abs path.
  // > + This can still be overridden by this target's definition below.
  // > `scope` is being mutated here!
  if (!_.isUndefined(parentGenerator.templatesDirectory)) {
    scope.templatesDirectory = parentGenerator.templatesDirectory;
  }

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


      //  ╦  ╔═╗╔═╗╔╦╗  ╔═╗╦  ╦╔═╗╦═╗╦═╗╦╔╦╗╔═╗
      //  ║  ║ ║╠═╣ ║║  ║ ║╚╗╔╝║╣ ╠╦╝╠╦╝║ ║║║╣
      //  ╩═╝╚═╝╩ ╩═╩╝  ╚═╝ ╚╝ ╚═╝╩╚═╩╚═╩═╩╝╚═╝
      //  ┌─    ┬┌─┐  ┌─┐┬  ┬┌─┐┬─┐┬─┐┬┌┬┐┌─┐┌┐ ┬  ┌─┐    ─┐
      //  │───  │├┤   │ │└┐┌┘├┤ ├┬┘├┬┘│ ││├─┤├┴┐│  ├┤   ───│
      //  └─    ┴└    └─┘ └┘ └─┘┴└─┴└─┴─┴┘┴ ┴└─┘┴─┘└─┘    ─┘
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
            generatorType: target.overridable,
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

      //  ╦  ╔═╗╔═╗╔╦╗  ╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗╦═╗
      //  ║  ║ ║╠═╣ ║║   ║ ╠═╣╠╦╝║ ╦║╣  ║   ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║ ║╠╦╝
      //  ╩═╝╚═╝╩ ╩═╩╝   ╩ ╩ ╩╩╚═╚═╝╚═╝ ╩   ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝╩╚═
      //  ┌─    ┬┌─┐  ┌─┐┌─┐┌─┐┌─┐┬┌─┐┬┌─┐┌┬┐  ┌─┐┌─┐  ┌─┐┌┬┐┬─┐┬┌┐┌┌─┐    ─┐
      //  │───  │├┤   └─┐├─┘├┤ │  │├┤ │├┤  ││  ├─┤└─┐  └─┐ │ ├┬┘│││││ ┬  ───│
      //  └─    ┴└    └─┘┴  └─┘└─┘┴└  ┴└─┘─┴┘  ┴ ┴└─┘  └─┘ ┴ ┴└─┴┘└┘└─┘    ─┘
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
              return proceed(e);

            // If an unexpected fatal error occurred, handle it.
            default:
              return proceed(e);

          }
        }//</catch>
      }//>-•

      //  ┌─┐┬ ┬┌─┐┌─┐┬┌─  ┬┌─┐  ┌┬┐┬ ┬┬┌─┐  ┌┬┐┌─┐┬─┐┌─┐┌─┐┌┬┐
      //  │  ├─┤├┤ │  ├┴┐  │├┤    │ ├─┤│└─┐   │ ├─┤├┬┘│ ┬├┤  │
      //  └─┘┴ ┴└─┘└─┘┴ ┴  ┴└     ┴ ┴ ┴┴└─┘   ┴ ┴ ┴┴└─└─┘└─┘ ┴
      //  ┬─┐┌─┐┌─┐┌─┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐  ┌─┐  ╔╗ ╦ ╦╦╦ ╔╦╗  ╦╔╗╔
      //  ├┬┘├┤ ├┤ ├┤ ├┬┘├┤ ││││  ├┤ └─┐  ├─┤  ╠╩╗║ ║║║  ║───║║║║
      //  ┴└─└─┘└  └─┘┴└─└─┘┘└┘└─┘└─┘└─┘  ┴ ┴  ╚═╝╚═╝╩╩═╝╩   ╩╝╚╝
      // Determine if the target is pointed at a builtin.
      var isTargetPointedAtBuiltin = _.intersection(_.keys(target), KNOWN_BUILTINS).length > 0;

      // If target is pointed at a builtin, then bail now.
      // (we can use the target exactly as-is)
      if (isTargetPointedAtBuiltin) {
        return proceed();
      }//-•


      //  ┌─┐┌─┐┌─┐┬ ┬┌┬┐┌─┐  ┌┬┐┌─┐┬─┐┌─┐┌─┐┌┬┐  ┌┐┌┌─┐┬ ┬  ┌─┐┌─┐┌┐┌┌┬┐┌─┐┬┌┐┌┌─┐
      //  ├─┤└─┐└─┐│ ││││├┤    │ ├─┤├┬┘│ ┬├┤  │   ││││ ││││  │  │ ││││ │ ├─┤││││└─┐
      //  ┴ ┴└─┘└─┘└─┘┴ ┴└─┘   ┴ ┴ ┴┴└─└─┘└─┘ ┴   ┘└┘└─┘└┴┘  └─┘└─┘┘└┘ ┴ ┴ ┴┴┘└┘└─┘
      //  ┌─┐┌┐┌  ╦╔╗╔╦  ╦╔╗╔╔═╗  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗╦═╗  ╔╦╗╔═╗╔═╗╦╔╗╔╦╔╦╗╦╔═╗╔╗╔
      //  ├─┤│││  ║║║║║  ║║║║║╣   ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║ ║╠╦╝   ║║║╣ ╠╣ ║║║║║ ║ ║║ ║║║║
      //  ┴ ┴┘└┘  ╩╝╚╝╩═╝╩╝╚╝╚═╝  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝╩╚═  ═╩╝╚═╝╚  ╩╝╚╝╩ ╩ ╩╚═╝╝╚╝
      // IWMIH, then we can assume that this target is referencing a generator (or at least trying to).
      // That means we can expect `target.generator` to be present, and to be a valid inline generator
      // definition.

      // Verify that the `generator` of our target is now a dictionary, like it should be.
      if (!_.isPlainObject(target.generator)) {
        return proceed(new Error('Generator error: Invalid sub-generator configuration for target "' + scope.rootPath + '".'));
      }

      // Otherwise, the target's `generator` is a dictionary, so we'll treat it as an inline
      // sub-generator definition and finish up.
      target = target.generator;

      return proceed();

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

      // Interpret generator definition:
      // (note that `scope` is being mutated along the way!)

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
