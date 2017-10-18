/**
 * `tasks/register/buildProd.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed instead of `build` if you
 * run `sails www` in a production environment, e.g.:
 * `NODE_ENV=production sails www`
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/build-prod-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('buildProd', [
    'polyfill:prod', // <-- Remove this is you don't need/want to transpile code to ES2015 (see note below).
    'compileAssets',
    'babel',         // <-- Remove this is you don't need/want to transpile code to ES2015 (see note below).
    'concat',
    'uglify',
    'cssmin',
    'linkAssetsBuildProd',
    'clean:build',
    'copy:build'
  ]);
};

