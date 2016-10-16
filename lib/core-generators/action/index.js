/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');




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
      return _.kebabCase(segment);
    }).join('/');
    // (And of course, finally, we tack on `.js` at the end-- we're not barbarians after all.)
    scope.relPath += '.js';

    // Grab the filename for potential use in our template.
    scope.filename = path.basename(scope.relPath);


    _.defaults(scope, {
      friendlyName: scope.friendlyName || _.map(_.words(scope.actionName), function (word, i){ if (i===0) { return _.capitalize(word); } else { return word; } }).join(' '),
      description: scope.description || '',
      inferredViewTemplatePath: '',
      verbose: false
    });

    // If actionName begins with "view", then make an assumption about what to generate.
    // (set up the success exit with `viewTemplatePath` ready to go)
    if (scope.actionName.match(/^view/i)) {
      var inferredViewTemplateBasename = _.kebabCase(_.words(scope.actionName).slice(1)) || 'todo';
      var inferredViewTemplatePath = path.join('pages/', inferredViewTemplateBasename);
      scope.inferredViewTemplatePath = inferredViewTemplatePath;
    }//>-

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

    // Call out to both the model and controller generators.
    './api/controllers/:relPath': { template: 'actions2-action.template' }

  },


  //  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗╔═╗  ╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗╦═╗╦ ╦
  //   ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣ ╚═╗   ║║║╠╦╝║╣ ║   ║ ║ ║╠╦╝╚╦╝
  //   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝╚═╝  ═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝╩╚═ ╩
  templatesDirectory: path.resolve(__dirname,'./templates'),

};
