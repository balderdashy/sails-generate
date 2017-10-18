/**
 * `tasks/config/babel`
 *
 * ---------------------------------------------------------------
 *
 * Transpile ES6 code to ES2015.
 *
 * For more information, see:
 *   https://sailsjs.com/anatomy/tasks/config/babel-js
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
