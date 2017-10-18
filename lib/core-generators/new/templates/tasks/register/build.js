/**
 * `tasks/register/build.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed if you run `sails www` or
 * `grunt build` in a development environment.
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/build-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('build', [
    'polyfill:dev', // <-- uncomment if you need/want to transpile code to ES2015 in development.
    'compileAssets',
    'babel',        // <-- uncomment if you need/want to transpile code to ES2015 in development.
    'linkAssetsBuild',
    'clean:build',
    'copy:build'
  ]);
};
