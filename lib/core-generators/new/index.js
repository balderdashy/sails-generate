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
            baseStringToHash += Math.random() * (Math.random() * 1000);
            baseStringToHash += process.version;

            // Now cook up some hash using the base string.
            // > This will be used as the session secret we inject into the `config/session.js` file.
            scope.secret = crypto.createHash('md5').update(baseStringToHash).digest('hex');


            // console.log('inside the backend subgenerator, here\'s the scope:', scope);
            // console.log('scope.frontend',scope.frontend)

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
                    './views/403.ejs': { copy: 'views/403.ejs' },
                    './views/404.ejs': { copy: 'views/404.ejs' },
                    './views/500.ejs': { copy: 'views/500.ejs' },
                    './views/homepage.ejs': { copy: 'views/homepage.ejs' },
                    './views/layout.ejs': { copy: 'views/layout.ejs' }
                  }
                }
              }//</views>
            ],


            // /api
            './api/controllers':          { folder: {} },
            './api/controllers/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },

            './api/models':               { folder: {} },
            './api/models/.gitkeep':      { copy: '../../../shared-templates/gitkeep.template' },

            './api/helpers':              { folder: {} },
            './api/helpers/.gitkeep':     { copy: '../../../shared-templates/gitkeep.template' },

            './api/policies': { folder: {} },
            './api/policies/sessionAuth.js': { copy: 'api/policies/sessionAuth.js' },

            './api/responses': { folder: {} },
            './api/responses/badRequest.js': { copy: 'api/responses/badRequest.js' },
            './api/responses/forbidden.js': { copy: 'api/responses/forbidden.js' },
            './api/responses/notFound.js': { copy: 'api/responses/notFound.js' },
            './api/responses/serverError.js': { copy: 'api/responses/serverError.js' },
            './api/responses/ok.js': { copy: 'api/responses/ok.js' },

            // /config
            './config': { folder: {} },
            './config/blueprints.js': { copy: 'config/blueprints.js' },
            './config/bootstrap.js': { copy: 'config/bootstrap.js' },
            './config/datastores.js': { copy: 'config/datastores.js' },
            './config/globals.js': { copy: 'config/globals.js' },
            './config/http.js': { copy: 'config/http.js' },
            './config/i18n.js': { copy: 'config/i18n.js' },
            './config/log.js': { copy: 'config/log.js' },
            './config/models.js': { copy: 'config/models.js' },
            './config/policies.js': { copy: 'config/policies.js' },
            './config/routes.js': { template: 'config/routes.js.template' },
            './config/security.js': { copy: 'config/security.js' },
            './config/session.js': { template: 'config/session.js' },
            './config/sockets.js': { copy: 'config/sockets.js' },
            './config/views.js': { template: 'config/views.js' },

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
          before: function (scope, done){
            console.log('inside the frontend subgenerator, here\'s the scope:', scope);
            console.log('scope.frontend',scope.frontend);
            return done();
          },
          targets: {

            //  ╔═╗╔═╗╔═╗╔═╗╔╦╗╔═╗
            //  ╠═╣╚═╗╚═╗║╣  ║ ╚═╗
            //  ╩ ╩╚═╝╚═╝╚═╝ ╩ ╚═╝
            // Default assets folder and contents:
            './assets':                       { folder: {} },
            './assets/favicon.ico':           { copy: 'assets/favicon.ico' },
            './assets/robots.txt':            { template: 'assets/robots.txt' },

            './assets/images':                { folder: {} },
            './assets/images/.gitkeep':       { copy: '../../../shared-templates/gitkeep.template' },

            './assets/styles':                { folder: {} },
            './assets/styles/importer.less':  { template: 'assets/styles/importer.less' },

            './assets/templates':             { folder: {} },
            './assets/templates/.gitkeep':    { copy: '../../../shared-templates/gitkeep.template' },

            './assets/js':                    { folder: {} },
            './assets/js/.gitkeep':           { copy: '../../../shared-templates/gitkeep.template' },

            './assets/dependencies':          { folder: {} },
            './assets/dependencies/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },


            //  ███████╗ █████╗ ██╗██╗     ███████╗   ██╗ ██████╗         ██╗███████╗
            //  ██╔════╝██╔══██╗██║██║     ██╔════╝   ██║██╔═══██╗        ██║██╔════╝
            //  ███████╗███████║██║██║     ███████╗   ██║██║   ██║        ██║███████╗
            //  ╚════██║██╔══██║██║██║     ╚════██║   ██║██║   ██║   ██   ██║╚════██║
            //  ███████║██║  ██║██║███████╗███████║██╗██║╚██████╔╝██╗╚█████╔╝███████║
            //  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝╚═╝ ╚═════╝ ╚═╝ ╚════╝ ╚══════╝
            //
            // Call sails.io.js sub-generator to create the browser sdk at the conventional location
            // (in `assets/dependencies/sails.io.js`)
            './': [
              {
                overridable: 'sails.io.js',
                generator: {
                  // `templatesDirectory` is the  absolute path to the templates for this generator,
                  // for use with the `template` & `copy` builtins.
                  //
                  // > Note that, in this case, the templates folder is actually deferred
                  // > to a dependency: an NPM package called `sails.io.js-dist`.
                  templatesDirectory: path.dirname(require.resolve('sails.io.js-dist')),
                  // ^^FUTURE: consider changing this.
                  //
                  // Currently, require.resolve could return something like:
                  // `/Users/mikermcneil/code/sails-generate-sails.io.js/node_modules/sails.io.js-dist/sails.io.js'
                  // But in certain edge cases w/ different npm versions + npm link, it seems like it might
                  // potentially return something else, which could cause an issue when combining w/ dirname
                  // (because it goes up one too many dirs).  This could be related to the issue w/ the skipAssets
                  // tests in Sails...
                  targets: {
                    './assets/dependencies/sails.io.js': { template: 'sails.io.js' }
                  }
                }
              }//</sails.io.js>
            ],

            //  ╔╦╗╔═╗╔═╗╦╔═╔═╗
            //   ║ ╠═╣╚═╗╠╩╗╚═╗
            //   ╩ ╩ ╩╚═╝╩ ╩╚═╝
            // Default tasks/ folder and contents:

            // asset pipeline setup
            './tasks/pipeline.js': { template: 'tasks/pipeline.js' },


            // grunt task configurations (`tasks/config`)
            './tasks/config/clean.js':        { copy: 'tasks/config/clean.js' },
            './tasks/config/coffee.js':       { copy: 'tasks/config/coffee.js' },
            './tasks/config/concat.js':       { copy: 'tasks/config/concat.js' },
            './tasks/config/copy.js':         { copy: 'tasks/config/copy.js' },
            './tasks/config/cssmin.js':       { copy: 'tasks/config/cssmin.js' },
            './tasks/config/jst.js':          { copy: 'tasks/config/jst.js' },
            './tasks/config/less.js':         { copy: 'tasks/config/less.js' },
            './tasks/config/sails-linker.js': { copy: 'tasks/config/sails-linker.js' },
            './tasks/config/sync.js':         { copy: 'tasks/config/sync.js' },
            './tasks/config/uglify.js':       { copy: 'tasks/config/uglify.js' },

            './tasks/config/watch.js':        { template: 'tasks/config/watch.js.template' },


            // built-in grunt tasks which are automatically called by Sails (`tasks/register`)
            './tasks/register/build.js':               { copy: 'tasks/register/build.js' },
            './tasks/register/buildProd.js':           { copy: 'tasks/register/buildProd.js' },
            './tasks/register/compileAssets.js':       { copy: 'tasks/register/compileAssets.js' },
            './tasks/register/linkAssets.js':          { copy: 'tasks/register/linkAssets.js' },
            './tasks/register/linkAssetsBuild.js':     { copy: 'tasks/register/linkAssetsBuild.js' },
            './tasks/register/linkAssetsBuildProd.js': { copy: 'tasks/register/linkAssetsBuildProd.js' },
            './tasks/register/prod.js':                { copy: 'tasks/register/prod.js' },
            './tasks/register/syncAssets.js':          { copy: 'tasks/register/syncAssets.js' },

            './tasks/register/default.js':             { template: 'tasks/register/default.js.template' },
          }
        }
      },//</frontend>
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

    './package.json':    { jsonfile: require('./get-package-json-data') },
    './app.js':          { copy: 'app.js.template' },

    './.sailsrc':        { jsonfile: require('./get-sailsrc-data') },
    './README.md':       { template: './README.md.template' },
  }

};


