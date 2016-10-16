/**
 * `tasks/config/clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove the files and folders in your Sails app's web root
 * (conventionally a hidden directory called `.tmp/public`).
 *
 * For more information, see:
 *   http://sailsjs.com/anatomy/tasks/config/clean-js
 *
 */
module.exports = function(grunt) {

  grunt.config.set('clean', {
    dev: ['.tmp/public/**'],
    build: ['www']
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
