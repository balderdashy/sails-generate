/**
 * Module dependencies
 */

var path = require('path');


/**
 * Usage:
 * `sails generate etc`
 *
 * @type {Dictionary}
 */

 module.exports = {

  templatesDirectory: path.resolve(__dirname,'./templates'),

  targets: {
   './.gitignore':                  { copy: '../../../shared-templates/gitignore.template' },
   './.jshintrc':                   { copy: '../../../shared-templates/jshintrc.template' },
   './.editorconfig':               { copy: '../../../shared-templates/editorconfig.template' },
   './.npmignore':                  { copy: '../../../shared-templates/npmignore.template' },
   './.travis.yml':                 { copy: '../../../shared-templates/npmignore.template' },
  },

  before: function (scope, done) {
    return done();
  }

};
