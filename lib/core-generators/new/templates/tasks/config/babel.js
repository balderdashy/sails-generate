/**
 * `tasks/config/babel`
 *
 * ---------------------------------------------------------------
 *
 * Transpile ES6 code to ES2015.
 * This is typically run as part of the "transpile" task, which also adds a polyfill file
 * to the outputted JS file that allows older browsers to run the code.
 *
 */
module.exports = function(grunt) {

  grunt.config.set('babel', {
    dist: {
      options: {
        presets: [require('sails-hook-grunt/accessible/babel-preset-env')]
      },
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['js/**/*.js'],
        dest: '.tmp/public'
      }]
    }
  });

};
