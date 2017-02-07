/**
 * Module dependencies
 */

var path = require('path');
var https = require('https');
var _ = require('lodash');
var fsx = require('fs-extra');
var builtinCopy = require('../../builtins/copy');

/**
 * sails-generate-sails.io.js
 *
 * Usage:
 * `sails generate sails.io.js <location>`
 *
 * @type {Dictionary}
 */

var GITHUB_RAW_URL = 'https://raw.githubusercontent.com/balderdashy/sails.io.js/master/dist/sails.io.js';

module.exports = {

  before: function(scope, done) {

    if (_.isArray(scope.args) && scope.args[0]) {
      scope.dest = path.resolve(scope.topLvlRootPath, scope.args[0]);
    }

    else {

      // See if we can locate the current location of `sails.io.js`.
      scope.dest = (function() {

        var pathToTry = path.resolve(scope.topLvlRootPath, 'assets', 'dependencies', 'sails.io.js');
        if (fsx.existsSync(pathToTry)) {
          return pathToTry;
        }
        pathToTry = path.resolve(scope.topLvlRootPath, 'assets', 'js', 'dependencies', 'sails.io.js');
        if (fsx.existsSync(pathToTry)) {
          return pathToTry;
        }
        throw new Error('Could not automatically determine location of `sails.io.js` in your project.  Please specify it with `sails generate sails.io.js <destination>`.');

      })();

    }

    // This generator is intended to overwrite whatever sails.io.js they already have.
    scope.force = true;

    return done();

  },

  //  ╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗
  //   ║ ╠═╣╠╦╝║ ╦║╣  ║ ╚═╗
  //   ╩ ╩ ╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  targets: {

    'sails.io.js': {
      exec: function(scope, done) {

        var destFileStream = fsx.createWriteStream(scope.dest);

        // Try to stream the latest sails.io.js to disk
        https.get(GITHUB_RAW_URL, function(response) {
          response.pipe(destFileStream);
          // When the stream finishes, close it and we're done.
          destFileStream.on('finish', function() {
            console.log('Copied latest sails.io.js from https://raw.githubusercontent.com/balderdashy/sails.io.js/master/dist/sails.io.js...');
            destFileStream.close(done);
          });
        })
        // If there's an error streaming, fall back to copying the version we have cached.
        .on('error', function() {
          console.error('Could not load latest `sails.io.js` from Github.  Are you connected to the internet?');
          console.error('Falling back to cached version...');

          scope.templatesDirectory = path.dirname(require.resolve('sails.io.js-dist'));
          scope.templatePath = 'sails.io.js';
          scope.rootPath = scope.dest;
          builtinCopy(scope, function(err) {
            if (err) {
              return done(err);
            }
            return done();
          });
        });

      }
    }

  }
};
