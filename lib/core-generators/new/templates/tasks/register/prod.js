/**
 * `tasks/register/prod.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed instead of `default` when
 * your Sails app is lifted in a production environment (e.g. using
 * `NODE_ENV=production node app`).
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/prod-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('prod', [
    'polyfill:prod', // <-- Remove this is you don't need/want to transpile code to ES2015 (see note below).
    'compileAssets',
    'babel',         // <-- Remove this is you don't need/want to transpile code to ES2015 (see note below).
    'concat',
    'uglify',
    'cssmin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:clientSideTemplates',
  ]);
};

// A note about transpiling:
// -------------------------
// The default "uglify" task _cannot_ handle JavaScript written with ES6 syntax (arrow functions, await, etc.).
//
// If your assets/js/** folders contain front-end JavaScript files with ES6, you will need to either
// transpile the code using the provided `babel` task (as well as the recommended `polyfill` task to provide
// polyfills for features such as Promises), or else use a different uglifier (or don't uglify your code at all).
//
// More details about this are available in the `tasks/uglify.js` file.
