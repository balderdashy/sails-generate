/**
 * `tasks/config/uglify`
 *
 * ---------------------------------------------------------------
 *
 * Minify client-side JavaScript files using UglifyJS.
 *
 * For more information, see:
 *   http://sailsjs.com/anatomy/tasks/config/uglify-js
 *
 */
module.exports = function(grunt) {

  grunt.config.set('uglify', {
    dist: {
      src: ['.tmp/public/concat/production.js'],
      dest: '.tmp/public/min/production.min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
