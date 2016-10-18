/**
 * sails-generate-generator
 *
 * Usage:
 * `sails generate generator :type`
 *
 * @scope {String} type    [required, type of generator to create]
 *
 * @type {Dictionary}
 */
module.exports = {

  templatesDirectory: require('path').resolve(__dirname,'./templates'),

  before: require('./before'),

  targets: {
    './index.js':           { template: 'index.js.template' },
    './README.md':          { template: 'README.md' },
    './.gitignore':         { template: 'gitignore.template' },
    './.jshintrc':          { template: 'jshintrc.template' },
    './.editorconfig':      { template: 'editorconfig.template' },
    './.npmignore':         { template: 'npmignore.template' },
    './package.json':       { template: 'package.json.template' },
    './templates/.gitkeep': { template: '.gitkeep' },
  }
};
