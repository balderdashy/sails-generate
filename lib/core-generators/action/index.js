/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');
var fsx = require('fs-extra');



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
      // Otherwise, we'll infer an appropriate friendly name further on down. and just use the
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

    _.defaults(scope, {
      friendlyName: scope.friendlyName || _.map(_.words(stem), function (word, i){ if (i===0) { return _.capitalize(word); } else { return word[0].toLowerCase() + word.slice(1); } }).join(' '),
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
    // If the specified relative path is "security/grant-csrf-token", then make an assumption and go ahead and
    // generate a simple exampl override of the corresponding built-in action from the `security` hook.
    // TODO

    // BLUEPRINTS HOOK
    // ================================================
    // If action stem is "find", and the name of a resource can be inferred from the specified relative path,
    // then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.
    // TODO

    // If action stem is "findOne", and the name of a resource can be inferred from the specified relative path,
    // then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.
    // TODO

    // If action stem is "create", and the name of a resource can be inferred from the specified relative path,
    // then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.
    // TODO

    // If action stem is "update", and the name of a resource can be inferred from the specified relative path,
    // then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.
    // TODO

    // If action stem is "destroy", and the name of a resource can be inferred from the specified relative path,
    // then make an assumption and go ahead and generate a reified version of the corresponding blueprint action.
    // TODO



    //  ┌─┐┌┬┐┬ ┬┌─┐┬─┐  ┌─┐┬┌┬┐┌─┐┬  ┌─┐  ┌┬┐┬┌┬┐┌─┐  ┌─┐┌─┐┬  ┬┌─┐┬─┐┌─┐
    //  │ │ │ ├─┤├┤ ├┬┘  └─┐││││├─┘│  ├┤    │ ││││├┤───└─┐├─┤└┐┌┘├┤ ├┬┘└─┐
    //  └─┘ ┴ ┴ ┴└─┘┴└─  └─┘┴┴ ┴┴  ┴─┘└─┘   ┴ ┴┴ ┴└─┘  └─┘┴ ┴ └┘ └─┘┴└─└─┘

    // ACTION THAT SERVES A WEB PAGE
    // ================================================
    // If action stem begins with "view", then make an assumption about what to generate.
    // (set up the success exit with `viewTemplatePath` ready to go)
    if (stem.match(/^view/i)) {
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
    }//>-

    // ACTION THAT PROCESSES A SIGNUP FORM
    // ================================================
    // If action stem is "signup", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a signup form)
    if (stem === 'signup') {
      console.log('* * *   Using built-in `signup` boilerplate...   * * *');
      console.log('| WARNING: In order to use this action, you\'ll need to create a few different helpers');
      console.log('| and/or change the implementation.  The main purpose of this boilerplate is to help');
      console.log('| you get off the ground running.');
      scope.getAlternativeTemplate = function (){
        var jsTpl = fsx.readFileSync(path.resolve(__dirname, 'templates', stem+'-action.template'), 'utf8');
        var renderedJs = _.template(jsTpl)(scope);
        return renderedJs;
      };
    }//‡
    //
    // ACTION THAT PROCESSES A LOGIN FORM
    // ================================================
    // If action stem is "login", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a login form)
    else if (stem === 'login') {
      console.log('* * *   Using built-in `login` boilerplate...   * * *');
      scope.getAlternativeTemplate = function (){
        var jsTpl = fsx.readFileSync(path.resolve(__dirname, 'templates', stem+'-action.template'), 'utf8');
        var renderedJs = _.template(jsTpl)(scope);
        return renderedJs;
      };
    }//‡
    //
    // ACTION THAT PROCESSES A LOGOUT
    // ================================================
    // If action stem is "logout", then make an assumption about what to generate.
    // (get started with a boilerplate action that processes a logout)
    else if (stem === 'logout') {
      console.log('* * *   Using built-in `logout` boilerplate...   * * *');
      scope.getAlternativeTemplate = function (){
        var jsTpl = fsx.readFileSync(path.resolve(__dirname, 'templates', stem+'-action.template'), 'utf8');
        var renderedJs = _.template(jsTpl)(scope);
        return renderedJs;
      };
    }//‡
    //
    // ACTION THAT PROCESSES A CONTACT FORM
    // ================================================
    // If action stem is "contact-us", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a contact form)
    else if (stem === 'contact-us') {
      // TODO
    }//‡
    //
    // ACTION THAT PROCESSES A PASSWORD RECOVERY REQUEST
    // ================================================
    // If action stem is "send-password-recovery-email", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a form that requests a password recovery)
    else if (stem === 'send-password-recovery-email') {
      // TODO
    }//‡
    //
    // ACTION THAT CONSUMES A PASSWORD RECOVERY TOKEN
    // ================================================
    // If action stem is "reset-password", then make an assumption about what to generate.
    // (get started with a boilerplate handler for a "OK it's you-- now choose a new password" form)
    else if (stem === 'reset-password') {
      // TODO
    }//‡


    return done();

  },


  //  ╔═╗╔═╗╔╦╗╔═╗╦═╗
  //  ╠═╣╠╣  ║ ║╣ ╠╦╝
  //  ╩ ╩╚   ╩ ╚═╝╩╚═ooo
  after: function (scope, done) {
    done.log.debug('Using "actions2"...');
    done.log.debug('(see http://sailsjs.com/docs/concepts/controllers)');
    return done();
  },


  //  ╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗
  //   ║ ╠═╣╠╦╝║ ╦║╣  ║ ╚═╗
  //   ╩ ╩ ╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  targets: {

    './api/controllers/:relPath': { template: 'actions2-action.template' }

  },


  //  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗╔═╗  ╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗╦═╗╦ ╦
  //   ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣ ╚═╗   ║║║╠╦╝║╣ ║   ║ ║ ║╠╦╝╚╦╝
  //   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝╚═╝  ═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝╩╚═ ╩
  templatesDirectory: path.resolve(__dirname,'./templates'),

};
