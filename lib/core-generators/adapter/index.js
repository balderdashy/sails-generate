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
    './:adapterPath/.gitignore':                  { template: '../../../shared-templates/gitignore.template' },
    './:adapterPath/.jshintrc':                   { template: '../../../shared-templates/jshintrc.template' },
    './:adapterPath/.editorconfig':               { template: '../../../shared-templates/editorconfig.template' },
    './:adapterPath/.npmignore':                  { template: '../../../shared-templates/npmignore.template' },
    './:adapterPath/package.json':                { template: 'package.json.template' },
    './:adapterPath/test/integration/runner.js':  { template: 'test-templates/integration/runner.js' },
    './:adapterPath/test/unit/register.js':       { template: 'test-templates/unit/register.js' },
    './:adapterPath/test/unit/README.md':         { template: 'test-templates/unit/README.md' },
    './:adapterPath/index.js':                    { template: 'index.js.template' }
  }
};

