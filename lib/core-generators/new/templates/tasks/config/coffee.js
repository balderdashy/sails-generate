/**
 * `tasks/config/coffee`
 *
 * ---------------------------------------------------------------
 *
 * Compile CoffeeScript files located in `assets/js` into Javascript
 * and generate new `.js` files in `.tmp/public/js`.
 *
 * For more information, see:
 *   http://sailsjs.com/anatomy/tasks/config/coffee-js
 *
 */
module.exports = function(grunt) {

  grunt.config.set('coffee', {
    dev: {
      options: {
        bare: true,
        sourceMap: true,
        sourceRoot: './'
      },
      files: [{
        expand: true,
        cwd: 'assets/js/',
        src: ['**/*.coffee'],
        dest: '.tmp/public/js/',
        ext: '.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
};
