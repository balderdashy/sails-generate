/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _ = require('lodash');



/**
 * sails-generate-hook
 *
 * Usage:
 * `sails generate hook`
 *
 * @description Generates a hook
 * @help See http://sailsjs.com/docs/concepts/extending-sails/generators
 */

module.exports = {

  /**
   * `before()` is run before executing any of the `targets`
   * defined below.
   *
   * This is where we can validate user input, configure default
   * scope variables, get extra dependencies, and so on.
   *
   * @param  {Dictionary} scope
   * @param  {Function} cb    [callback]
   */

  before: function (scope, cb) {

    // scope.args are the raw command line arguments.
    //
    // e.g. if someone runs:
    // $ sails generate hook user find create update
    // then `scope.args` would be `['user', 'find', 'create', 'update']`
    if (!scope.args[0]) {
      return cb( new Error('Please provide a name for this hook.') );
    }

    // Attach defaults
    _.defaults(scope, {
      createdAt: new Date()
    });

    // Decide the output id for use in targets below:
    scope.id = scope.args[0];

    // When finished, we trigger a callback with no error
    // to begin generating files/folders as specified by
    // the `targets` below.
    return cb();
  },



  /**
   * The files/folders to generate.
   * @type {Dictionary}
   */

  targets: {
    './api/hooks/:id/index.js': { template: 'index.js.template' }
  },


  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` helper)
   *
   * @type {String}
   */
  templatesDirectory: path.resolve(__dirname, './templates')

};


