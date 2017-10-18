/**
 * `tasks/register/polyfill.js`
 *
 * polyfill:prod Adds a polyfill file to the top of the list of files to concatenate in prod/buildProd mode, so that
 * older browsers can run code that uses things like `Promise`.
 *
 * polyfill:dev provides the polyfill as a file linked via a <script> tag in your app.
 *
 */
var path = require('path');
module.exports = function(grunt) {
  grunt.registerTask('polyfill:prod', 'Add the polyfill file to the top of the list of files to concatenate', function() {
    grunt.config.set('concat.js.src', [require('sails-hook-grunt/accessible/babel-polyfill')].concat(grunt.config.get('concat.js.src')));
  });

  grunt.registerTask('polyfill:dev', 'Add the polyfill file to the top of the list of files to copy and link', function() {
    grunt.config.set('copy.dev.files', grunt.config.get('copy.dev.files').concat({
      expand: true,
      cwd: path.dirname(require('sails-hook-grunt/accessible/babel-polyfill')),
      src: path.basename(require('sails-hook-grunt/accessible/babel-polyfill')),
      dest: '.tmp/public/polyfill'
    }));
    var devLinkFiles = grunt.config.get('sails-linker.devJs.files');
    grunt.config.set('sails-linker.devJs.files', Object.keys(devLinkFiles).reduce(function(memo, glob) {
      memo[glob] = ['.tmp/public/polyfill/polyfill.min.js'].concat(devLinkFiles[glob]);
      return memo;
    }, {}));
  });
};

