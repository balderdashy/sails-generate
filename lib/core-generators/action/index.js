/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');
var builtinTemplate = require('../../builtins/template');
var inventDescription = require('../../invent-description');


/**
 * sails-generate-action
 *
 * Usage:
 * `sails generate action <name>`
 *
 * @type {Dictionary}
 */

module.exports = {


  //  ╔╗ ╔═╗╔═╗╔═╗╦═╗╔═╗
  //  ╠╩╗║╣ ╠╣ ║ ║╠╦╝║╣
  //  ╚═╝╚═╝╚  ╚═╝╩╚═╚═╝ooo
  before: function (scope, done){

    var roughName;

    // The default template to use.
    scope.templateName = 'action.template';

    // Set up the default suffix for easter-egg actions.
    var altTemplateSuffix = '-action.template';

    // If `--actions2` was used, switch the default template and easter-egg template suffix.
    if (scope.actions2) {
      scope.templateName = 'actions2.template';
      altTemplateSuffix = '-actions2.template';
    }

    // Accept --name
    if (scope.name) {
      roughName = scope.name;
    }
    // Or otherwise the first serial arg is the "roughName" of the action we want to create.
    else if (_.isArray(scope.args)) {

      // If more than one serial args were provided, they'll constitute the action friendly name
      // and we'll combine them to form the base name.
      if (scope.args.length >= 2) {
        // However, note that we first check to be sure no dots or slashes were used
        // (if so, this would throw things off)
        if (scope.args[0].match(/[\/\.]/)) {
          return done(new Error(
            'Too many serial arguments: A "." or "/" was specified in the name for this new action, but extra words were provided too.\n' +
            '(should be provided like either `v1.pages.view-profile` or `View profile`).'
          ));
        }

        scope.friendlyName = scope.args.join(' ');
        roughName = _.camelCase(scope.friendlyName);
      }
      // Otherwise, we'll infer an appropriate friendly name further on down, and just use the
      // first serial arg as our "roughName".
      else if (scope.args[0] && _.isString(scope.args[0])) {
        roughName = scope.args[0];
      }

    }//>-

    if (!roughName) {
      return done(new Error(
        'Missing argument: Please provide a name for the new action.\n' +
        '(should be "verby" and use the imperative mood; e.g. `view-profile` or `sign-up`).'
      ));
    }

    // Now get our actionName.
    // Be kind -- transform slashes to dots when creating the actionName.
    scope.actionName = roughName.replace(/\/+/g, '.');
    // Then split on dots and make sure each segment is using camel-case before recombining.
    scope.actionName = _.map(scope.actionName.split('.'), function (segment){
      return _.camelCase(segment);
    }).join('.');

    // After transformation, the actionName must contain only letters, numbers, and dots--
    // and start with a lowercased letter.
    if (!scope.actionName.match(/^[a-z][a-zA-Z0-9.]*$/)) {
      return done( new Error('The name `' + scope.actionName + '` is invalid. '+
                           'Action names must start with a lower-cased letter and contain only '+
                           'letters, numbers, and dots.'));
    }

    // If the action name contains something like "FooController", then simplify that.
    scope.actionName = scope.actionName.replace(/(\.?)(.+)controller\./i, '$1$2.');

    // Then get our `relPath` (filename / path).
    // When building the relPath, we convert any dots to slashes.
    scope.relPath = scope.actionName.replace(/\.+/g, '/');
    // Then split on slashes and make sure each segment is using kebab-case before recombining.
    scope.relPath = _.map(scope.relPath.split('/'), function (segment){
      // One exception: Don't kebab-case stuff like "v1".
      if (segment.match(/[a-z]+[0-9]+/)) { return segment; }
      return _.kebabCase(segment);
    }).join('/');
    // (And of course, finally, we tack on `.js` at the end-- we're not barbarians after all.)
    scope.relPath += '.js';

    // Grab the filename for potential use in our template.
    scope.filename = path.basename(scope.relPath);


    // Identify the action "stem" for use below.
    // (e.g. "view-stuff-and-things" from "v1.pages.view-stuff-and-things")
    var stem = _.last(scope.actionName.split('.'));
    var sentenceCaseStem = _.map(_.words(stem), function (word, i){ if (i===0) { return _.capitalize(word); } else { return word[0].toLowerCase() + word.slice(1); } }).join(' ');

    // Attempt to invent a description, if there isn't one already.
    if (_.isUndefined(scope.description)) {
      scope.description = inventDescription(scope.actionName);
    }//>-

    // Infer other defaults.
    _.defaults(scope, {
      friendlyName: scope.friendlyName || sentenceCaseStem,
      description: scope.description || '',
      inferredViewTemplatePath: '',
      verbose: false,
      getAlternativeTemplate: null
    });



    //  ┌┐ ┬ ┬┬┬ ┌┬┐  ┬┌┐┌  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐  ┌─┐┬─┐┌─┐┌┬┐  ┬ ┬┌─┐┌─┐┬┌─┌─┐
    //  ├┴┐│ │││  │───││││  ├─┤│   │ ││ ││││└─┐  ├┤ ├┬┘│ ││││  ├─┤│ ││ │├┴┐└─┐
    //  └─┘└─┘┴┴─┘┴   ┴┘└┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘└─┘  └  ┴└─└─┘┴ ┴  ┴ ┴└─┘└─┘┴ ┴└─┘

    // SECURITY HOOK
    // ================================================
    // FUTURE: If the specified relative path is "security/grant-csrf-token", then make an assumption and go
    // ahead and generate a simple exampl override of the corresponding built-in action from the `security` hook.

    // BLUEPRINTS HOOK
    // ================================================
    // FUTURE: If action stem is "find", and the name of a resource can be inferred from the specified relative
    // path, then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.

    // FUTURE: If action stem is "findOne", and the name of a resource can be inferred from the specified relative
    // path, then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.

    // FUTURE: If action stem is "create", and the name of a resource can be inferred from the specified relative
    // path, then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.

    // FUTURE: If action stem is "update", and the name of a resource can be inferred from the specified relative
    // path, then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.

    // FUTURE: If action stem is "destroy", and the name of a resource can be inferred from the specified relative
    // path, then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.



    //  ┌─┐┌┬┐┬ ┬┌─┐┬─┐  ┌─┐┬┌┬┐┌─┐┬  ┌─┐  ┌┬┐┬┌┬┐┌─┐  ┌─┐┌─┐┬  ┬┌─┐┬─┐┌─┐
    //  │ │ │ ├─┤├┤ ├┬┘  └─┐││││├─┘│  ├┤    │ ││││├┤───└─┐├─┤└┐┌┘├┤ ├┬┘└─┐
    //  └─┘ ┴ ┴ ┴└─┘┴└─  └─┘┴┴ ┴┴  ┴─┘└─┘   ┴ ┴┴ ┴└─┘  └─┘┴ ┴ └┘ └─┘┴└─└─┘

    // ACTION THAT SERVES A WEB PAGE
    // ================================================
    // If action stem begins with "view" (and if it's not just... "view" by itself--
    // which would be weird, but whatever), then make an assumption about what to generate.
    // (set up the success exit with `viewTemplatePath` ready to go)
    if (stem.match(/^view/i) && stem !== 'view') {
      var inferredViewTemplateBasename = _.reduce(_.words(stem).slice(1), function (memo, segment){
        // One exception: Don't kebab-case stuff like "v1".
        if (segment.match(/[a-z]+[0-9]+/)) {
          memo += segment;
        }
        else {
          memo += _.kebabCase(segment);
        }

        return memo;
      }, '');
      var inferredViewTemplatePath = path.join('pages/', inferredViewTemplateBasename);
      scope.inferredViewTemplatePath = inferredViewTemplatePath;

      // Adjust description:
      var friendlyPageName = _.words(sentenceCaseStem).slice(1);
      if (_.last(friendlyPageName).match(/page/i)){
        friendlyPageName = friendlyPageName.slice(0, -1);
      }
      friendlyPageName = friendlyPageName.join(' ');
      scope.description = 'Display '+friendlyPageName+' page.';
    }//>-

    // ACTION THAT PROCESSES A SIGNUP FORM
    // ================================================
    // If action stem is "signup", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a signup form)
    if (stem === 'signup') {
      console.log('* * *   You found an easter egg!                   * * *');
      console.log('* * *   (Using built-in `signup` boilerplate...)   * * *');
      console.log('| WARNING: Before using this generated action, you should take a moment to ');
      console.log('| read and fully understand the code.  You will probably need to change the ');
      console.log('| implementation to fit your needs, and that\'s OK: the purpose of this ');
      console.log('| generated action isn\'t a drop-in solution.  The goal is to help you get ');
      console.log('| off the ground running the right way, using recommended best practices.');
      scope.templateName = stem + altTemplateSuffix;
    }


    return done();

  },


  //  ╔═╗╔═╗╔╦╗╔═╗╦═╗
  //  ╠═╣╠╣  ║ ║╣ ╠╦╝
  //  ╩ ╩╚   ╩ ╚═╝╩╚═ooo
  after: function (scope, done) {
    if (scope.actions2) {
      done.log.debug('Using "actions2"...');
      done.log.debug('(see https://sailsjs.com/docs/concepts/actions)');
    }
    return done();
  },


  //  ╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗
  //   ║ ╠═╣╠╦╝║ ╦║╣  ║ ╚═╗
  //   ╩ ╩ ╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  targets: {

    './api/controllers/:relPath': {
      exec: function(scope, done) {
        scope.templatePath = './' + scope.templateName;
        builtinTemplate(scope, function(err) {
          if (err) {
            return done(err);
          }
          return done();
        });
      }
    }

  },


  //  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗╔═╗  ╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗╦═╗╦ ╦
  //   ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣ ╚═╗   ║║║╠╦╝║╣ ║   ║ ║ ║╠╦╝╚╦╝
  //   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝╚═╝  ═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝╩╚═ ╩
  templatesDirectory: path.resolve(__dirname,'./templates'),

};
