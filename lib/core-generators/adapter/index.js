/**
 * sails-generate-adapter
 *
 * Usage:
 * `sails generate adapter`
 *
 * @type {Object}
 */

module.exports = {

  templatesDirectory: require('path').resolve(__dirname,'../templates'),

  before: require('./before'),

  targets: {
  './:adaptersPath': {folder: {}},
    './:adaptersPath/CONTRIBUTING.md':    { template: 'CONTRIBUTING.md' },
    './:adaptersPath/FAQ.md':             { template: 'FAQ.md' },
    './:adaptersPath/LICENSE':            { template: 'LICENSE' },
    './:adaptersPath/README.md':          { template: 'README.md' },
    './:adaptersPath/.gitignore':         { template: 'gitignore' },
    './:adaptersPath/.jshintrc':          { template: '.jshintrc' },
    './:adaptersPath/.editorconfig':      { template: '.editorconfig' },
    './:adaptersPath/package.json':       { template: 'package.json' },
    './:adaptersPath/test/integration/runner.js': { template: 'test/integration/runner.js' },
    './:adaptersPath/test/unit/register.js': { template: 'test/unit/register.js' },
    './:adaptersPath/test/unit/README.md':   { template: 'test/unit/README.md' },
    './:adaptersPath/lib/adapter.js':              { template: 'adapter.js' },
    './:adaptersPath/:adapterMainFile.js':              { template: 'main.js' }
  }
};

