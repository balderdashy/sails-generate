/**
 * Module dependencies
 */

var path = require('path');


/**
 * sails-generate-parasails
 *
 * (Re)generate parsails.js + Cloud SDK.
 *
 * Usage:
 * `sails generate parasails`
 *
 * @type {Dictionary}
 */

module.exports = {

  before: function(scope, done) {

    // This generator is intended to overwrite whatever files already exist at
    // these locations.
    scope.force = true;

    return done();

  },

  // Set the templates directory to the `parasails` dependency's `dist/` folder.
  templatesDirectory: path.resolve(path.dirname(require.resolve('parasails')), 'dist/'),

  //  ╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗
  //   ║ ╠═╣╠╦╝║ ╦║╣  ║ ╚═╗
  //   ╩ ╩ ╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  targets: {
    './assets/dependencies/parasails.js': { copy: 'parasails.js' },
    './assets/dependencies/cloud.js':     { copy: 'cloud.js' }
  }
};
