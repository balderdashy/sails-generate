/**
 * Module dependencies
 */

var path = require('path');
var crypto = require('crypto');



/**
 * sails-generate-new
 *
 * Usage:
 * `sails new foo`
 *
 * @type {Dictionary}
 */

module.exports = {

  templatesDirectory: path.resolve(__dirname,'./templates'),

  // scopeExample: {
  //   // Required:
  //   args: ['my-new-app'],
  //   rootPath: '/Users/mikermcneil/code',
  //   sailsRoot: '/usr/local/lib/node_modules/sails',
  //
  //   // Automatic (but can be manually overridden:)
  //   appName: 'my-new-app',
  //   templatesDirectory: '/usr/local/lib/node_modules/sails/node_modules/sails-generate/node_modules/sails-generate-new/templates',
  // },

  before: require('./before'),

  after: require('./after'),

  targets: {

    '.': [
      //   ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗███████╗██╗██╗     ███████╗
      //  ██╔════╝ ██╔══██╗██║   ██║████╗  ██║╚══██╔══╝██╔════╝██║██║     ██╔════╝
      //  ██║  ███╗██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██║██║     █████╗
      //  ██║   ██║██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║██║     ██╔══╝
      //  ╚██████╔╝██║  ██║╚██████╔╝██║ ╚████║   ██║   ██║     ██║███████╗███████╗
      //   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝     ╚═╝╚══════╝╚══════╝
      //
      {
        overridable: 'gruntfile',
        generator: {
          targets: {
            './Gruntfile.js': { template: 'Gruntfile.js.template' },
            './tasks': { folder: {} },
            './tasks/config': { folder: {} },
            './tasks/register': { folder: {} },
          }
        }
      },//</gruntfile>
      //  ██████╗  █████╗  ██████╗██╗  ██╗███████╗███╗   ██╗██████╗
      //  ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝████╗  ██║██╔══██╗
      //  ██████╔╝███████║██║     █████╔╝ █████╗  ██╔██╗ ██║██║  ██║
      //  ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║╚██╗██║██║  ██║
      //  ██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██║ ╚████║██████╔╝
      //  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝
      //
      {
        overridable: 'backend',
        generator: {
          before: function(scope, cb) {

            //  ┌┐ ┌─┐┬┌─┌─┐  ┌─┐  ┬─┐┌─┐┌┐┌┌┬┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬─┐┌─┐┌┬┐
            //  ├┴┐├─┤├┴┐├┤   ├─┤  ├┬┘├─┤│││ │││ ││││  └─┐├┤ └─┐└─┐││ ││││  └─┐├┤ │  ├┬┘├┤  │
            //  └─┘┴ ┴┴ ┴└─┘  ┴ ┴  ┴└─┴ ┴┘└┘─┴┘└─┘┴ ┴  └─┘└─┘└─┘└─┘┴└─┘┘└┘  └─┘└─┘└─┘┴└─└─┘ ┴
            //  ┌─    ┌─┐┌─┐┬─┐  ╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╗╔  ╦╔═╗    ─┐
            //  │───  ├┤ │ │├┬┘  ╚═╗║╣ ╚═╗╚═╗║║ ║║║║  ║╚═╗  ───│
            //  └─    └  └─┘┴└─  ╚═╝╚═╝╚═╝╚═╝╩╚═╝╝╚╝o╚╝╚═╝    ─┘
            // Now bake up a session secret to inject into our `config/session.js` file.

            // Combine random and case-specific factors into a base string
            // (creation date, random number, and Node.js version string)
            var baseStringToHash = '';
            baseStringToHash += (new Date()).getTime();
            baseStringToHash += crypto.randomBytes(64).toString('hex');
            baseStringToHash += process.version;

            // Now cook up some hash using the base string.
            // > This will be used as the session secret we inject into the `config/session.js` file.
            scope.secret = crypto.createHash('md5').update(baseStringToHash).digest('hex');

            // Continue onwards to generate all those exciting files.
            return cb();
          },
          targets: {

            //  ██╗   ██╗██╗███████╗██╗    ██╗███████╗
            //  ██║   ██║██║██╔════╝██║    ██║██╔════╝
            //  ██║   ██║██║█████╗  ██║ █╗ ██║███████╗
            //  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║╚════██║
            //   ╚████╔╝ ██║███████╗╚███╔███╔╝███████║
            //    ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚══════╝
            //
            // Call out to `sails-generate-views`.
            '.': [
              {
                overridable: 'views',
                generator: {
                  targets: {
                    './views/404.ejs': { copy: 'views/404.ejs' },
                    './views/500.ejs': { copy: 'views/500.ejs' },
                    './views/layout.ejs': { copy: 'views/layout.ejs',  overridable: 'layout' },
                    './views/homepage.ejs': { copy: 'views/homepage.ejs',  overridable: 'homepage' },

                  }//</targets>
                }
              }//</views>
            ],


            // /api
            './api/controllers':          { folder: {} },
            './api/controllers/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },

            './api/models':               { folder: {}, overridable: 'api/models' },
            './api/models/.gitkeep':      { copy: '../../../shared-templates/gitkeep.template', overridable: 'api/models/.gitkeep' },

            './api/helpers':              { folder: {} },
            './api/helpers/.gitkeep':     { copy: '../../../shared-templates/gitkeep.template' },

            './api/policies': { folder: {} },
            './api/policies/isLoggedIn.js': { copy: 'api/policies/isLoggedIn.js' },

            // /config
            './config': { folder: {} },
            './config/blueprints.js': { copy: 'config/blueprints.js' },
            './config/bootstrap.js': { copy: 'config/bootstrap.js' },
            './config/datastores.js': { copy: 'config/datastores.js', overridable: 'config/models.js' },
            './config/globals.js': { template: 'config/globals.js.template' },
            './config/http.js': { copy: 'config/http.js' },
            './config/i18n.js': { copy: 'config/i18n.js' },
            './config/log.js': { copy: 'config/log.js' },
            './config/models.js': { copy: 'config/models.js', overridable: 'config/models.js' },
            './config/policies.js': { copy: 'config/policies.js' },
            './config/routes.js': { template: 'config/routes.js.template' },
            './config/security.js': { copy: 'config/security.js' },
            './config/session.js': { template: 'config/session.js' },
            './config/sockets.js': { copy: 'config/sockets.js', overridable: 'config/sockets.js' },
            './config/views.js': { template: 'config/views.js' },

            './config/custom.js': { template: 'config/custom.js' },
            './config/local.js': { copy: 'config/local.js' },
            './config/env/production.js': { copy: 'config/env/production.js' },

            './config/locales/de.json': { copy: 'config/locales/de.json' },
            './config/locales/en.json': { copy: 'config/locales/en.json' },
            './config/locales/es.json': { copy: 'config/locales/es.json' },
            './config/locales/fr.json': { copy: 'config/locales/fr.json' },

          }
        }
      },//</backend>
      //  ███████╗██████╗  ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗██████╗
      //  ██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║██╔══██╗
      //  █████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║██║  ██║
      //  ██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║██║  ██║
      //  ██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║██████╔╝
      //  ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝
      //
      {
        overridable: 'frontend',
        generator: {
          targets: {

            //  ╔═╗╔═╗╔═╗╔═╗╔╦╗╔═╗
            //  ╠═╣╚═╗╚═╗║╣  ║ ╚═╗
            //  ╩ ╩╚═╝╚═╝╚═╝ ╩ ╚═╝
            // Default assets folder and contents:
            './assets': {
              overridable: 'assets',
              generator: {
                targets: {
                  '.':                       { folder: {} },
                  './favicon.ico':           { copy: 'assets/favicon.ico' },
                  './robots.txt':            { template: 'assets/robots.txt' },
                  './.eslintrc':             { copy: 'assets/eslintrc-override.template' },

                  './images':                { folder: {} },
                  './images/.gitkeep':       { copy: '../../../shared-templates/gitkeep.template' },

                  './styles':                { folder: {} },
                  './styles/importer.less':  { template: 'assets/styles/importer.less' },

                  './templates':             { folder: {} },
                  './templates/.gitkeep':    { copy: '../../../shared-templates/gitkeep.template' },

                  './js':                    { folder: {} },
                  './js/.gitkeep':           { copy: '../../../shared-templates/gitkeep.template' },

                  './dependencies':          { folder: {} },
                  './dependencies/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },

                }//</targets>
              }//</generator>
            },//</ assets/ >

            //  ╔╦╗╔═╗╔═╗╦╔═╔═╗
            //   ║ ╠═╣╚═╗╠╩╗╚═╗
            //   ╩ ╩ ╩╚═╝╩ ╩╚═╝
            // Default tasks/ folder and contents:
            './tasks/': {
              overridable: 'grunttasks',
              generator: {
                targets: {

                  // asset pipeline setup
                  './pipeline.js':            { template: 'tasks/pipeline.js' },


                  // grunt task configurations (`tasks/config/`)
                  './config/clean.js':        { copy: 'tasks/config/clean.js' },
                  './config/coffee.js':       { copy: 'tasks/config/coffee.js' },
                  './config/concat.js':       { copy: 'tasks/config/concat.js' },
                  './config/copy.js':         { copy: 'tasks/config/copy.js' },
                  './config/cssmin.js':       { copy: 'tasks/config/cssmin.js' },
                  './config/jst.js':          { copy: 'tasks/config/jst.js' },
                  './config/less.js':         { copy: 'tasks/config/less.js' },
                  './config/sails-linker.js': { copy: 'tasks/config/sails-linker.js' },
                  './config/sync.js':         { copy: 'tasks/config/sync.js' },
                  './config/uglify.js':       { copy: 'tasks/config/uglify.js' },

                  './config/watch.js':        { template: 'tasks/config/watch.js.template' },


                  // intermediate grunt tasklists (`tasks/register`)
                  './register/linkAssets.js':          { copy: 'tasks/register/linkAssets.js' },
                  './register/linkAssetsBuild.js':     { copy: 'tasks/register/linkAssetsBuild.js' },
                  './register/linkAssetsBuildProd.js': { copy: 'tasks/register/linkAssetsBuildProd.js' },
                  './register/syncAssets.js':          { copy: 'tasks/register/syncAssets.js' },
                  './register/compileAssets.js':       { copy: 'tasks/register/compileAssets.js' },


                  // built-in grunt tasks which are automatically called by Sails (`tasks/register/`)
                  './register/build.js':               { copy: 'tasks/register/build.js' },
                  './register/buildProd.js':           { copy: 'tasks/register/buildProd.js' },
                  './register/prod.js':                { copy: 'tasks/register/prod.js' },

                  './register/default.js':             { template: 'tasks/register/default.js.template' },

                }
              }
            }//</ tasks/ >

          }
        }
      },//</frontend>


      //  ███████╗ █████╗ ██╗██╗     ███████╗   ██╗ ██████╗         ██╗███████╗
      //  ██╔════╝██╔══██╗██║██║     ██╔════╝   ██║██╔═══██╗        ██║██╔════╝
      //  ███████╗███████║██║██║     ███████╗   ██║██║   ██║        ██║███████╗
      //  ╚════██║██╔══██║██║██║     ╚════██║   ██║██║   ██║   ██   ██║╚════██║
      //  ███████║██║  ██║██║███████╗███████║██╗██║╚██████╔╝██╗╚█████╔╝███████║
      //  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝╚═╝ ╚═════╝ ╚═╝ ╚════╝ ╚══════╝
      //
      // Call sails.io.js sub-generator to create the browser sdk at the conventional location
      // (in `assets/dependencies/sails.io.js`)
      'sails.io.js',

    ],

    //  ███╗   ███╗██╗███████╗ ██████╗
    //  ████╗ ████║██║██╔════╝██╔════╝
    //  ██╔████╔██║██║███████╗██║
    //  ██║╚██╔╝██║██║╚════██║██║
    //  ██║ ╚═╝ ██║██║███████║╚██████╗
    //  ╚═╝     ╚═╝╚═╝╚══════╝ ╚═════╝
    //
    './.gitignore':      { copy: 'gitignore.template' },
    './.editorconfig':   { copy: 'editorconfig.template' },
    './.jshintrc':       { copy: 'jshintrc.template' },
    './.eslintrc':       { copy: 'eslintrc.template' },
    './.eslintignore':   { copy: 'eslintignore.template' },

    './package.json':    { jsonfile: require('./get-package-json-data') },
    './app.js':          { copy: 'app.js.template' },

    './.sailsrc':        { jsonfile: require('./get-sailsrc-data') },
    './README.md':       { template: './README.md.template' },
  }

};


