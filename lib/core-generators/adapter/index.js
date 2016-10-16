/**
 * sails-generate-adapter
 *
 * Usage:
 * `sails generate adapter`
 *
 * @type {Dictionary}
 */

module.exports = {

  templatesDirectory: require('path').resolve(__dirname,'./templates'),

  before: require('./before'),

  targets: {
    './:adapterPath': {folder: {}},
    './:adapterPath/README.md':                   { template: 'README.md' },
    './:adapterPath/.gitignore':                  { template: 'gitignore' },
    './:adapterPath/.jshintrc':                   { template: '.jshintrc' },
    './:adapterPath/.editorconfig':               { template: '.editorconfig' },
    './:adapterPath/package.json':                { template: 'package.json' },
    './:adapterPath/test/integration/runner.js':  { template: 'test/integration/runner.js' },
    './:adapterPath/test/unit/register.js':       { template: 'test/unit/register.js' },
    './:adapterPath/test/unit/README.md':         { template: 'test/unit/README.md' },
    './:adapterPath/index.js':                    { template: 'index.js' }
  }
};

