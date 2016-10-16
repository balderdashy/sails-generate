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

    if (scope.name) {
      scope.basename = _.kebabCase(scope.name);
    }
    else if (_.isArray(scope.args)) {
      if (scope.args[0] && _.isString(scope.args[0])) {
        scope.basename = _.kebabCase(scope.args[0]);
      }
    }

    if (!scope.basename) {
      return cb(new Error(
        'Missing argument: Please provide a name for the new action.\n' +
        '(should be "verby" and use the imperative mood; e.g. `view-profile` or `sign-up`).'
      ));
    }

    _.defaults(scope, {
      filename: scope.basename+'.js',
      friendlyName: scope.friendlyName || _.map(_.words(scope.basename), function (word, i){ if (i===0) { return _.capitalize(word); } else { return word; } }).join(' '),
      description: scope.description || '',
      inferredViewTemplatePath: '',
      verbose: false
    });

    // If basename begins with "view", then make an assumption about what to generate.
    // (set up the success exit with `viewTemplatePath` ready to go)
    if (scope.basename.match(/^view/i)) {
      var inferredViewTemplateBasename = _.kebabCase(_.words(scope.basename).slice(1)) || 'todo';
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
    './api/controllers/:filename': { template: 'actions2-action.template' }

  },


  //  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗╔═╗  ╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗╦═╗╦ ╦
  //   ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣ ╚═╗   ║║║╠╦╝║╣ ║   ║ ║ ║╠╦╝╚╦╝
  //   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝╚═╝  ═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝╩╚═ ╩
  templatesDirectory: path.resolve(__dirname,'./templates'),

};
