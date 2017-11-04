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

            //  ┌┐ ┌─┐┬┌─┌─┐  ┌─┐  ┬─┐┌─┐┌┐┌┌┬┐┌─┐┌┬┐  ┌┬┐┌─┐┌┬┐┌─┐  ┌─┐┌┐┌┌─┐┬─┐┬ ┬┌─┐┌┬┐┬┌─┐┌┐┌  ┬┌─┌─┐┬ ┬
            //  ├┴┐├─┤├┴┐├┤   ├─┤  ├┬┘├─┤│││ │││ ││││   ││├─┤ │ ├─┤  ├┤ ││││  ├┬┘└┬┘├─┘ │ ││ ││││  ├┴┐├┤ └┬┘
            //  └─┘┴ ┴┴ ┴└─┘  ┴ ┴  ┴└─┴ ┴┘└┘─┴┘└─┘┴ ┴  ─┴┘┴ ┴ ┴ ┴ ┴  └─┘┘└┘└─┘┴└─ ┴ ┴   ┴ ┴└─┘┘└┘  ┴ ┴└─┘ ┴
            //  ┌─    ┌─┐┌─┐┬─┐  ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗  ╦╔═╗    ─┐
            //  │───  ├┤ │ │├┬┘  ║║║║ ║ ║║║╣ ║  ╚═╗  ║╚═╗  ───│
            //  └─    └  └─┘┴└─  ╩ ╩╚═╝═╩╝╚═╝╩═╝╚═╝o╚╝╚═╝    ─┘
            // Now bake up a data encryption key to inject into our `config/models.js` file.
            // > e.g. 'DPjGWuGIfZuUPmSEuMtyXoO0zN9UG52vU1zoV0F2X1k='

            // Generate a cryptographically random 32 byte key string to use as this new app's
            // default DEK during development.
            scope.defaultDEK = crypto.randomBytes(32).toString('base64');


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
                    './views/layouts': { folder: {} },
                    './views/layouts/layout.ejs': { copy: 'views/traditional-layout.ejs',  overridable: 'layout' },

                    './views/emails':                              { onlyIf: 'caviar', folder: {} },
                    './views/emails/admin': { onlyIf: 'caviar', folder: {} },
                    './views/emails/admin/email-contact-form.ejs': { onlyIf: 'caviar', copy: 'views/emails/admin/email-contact-form.ejs' },
                    './views/emails/email-reset-password.ejs': { onlyIf: 'caviar', copy: 'views/emails/email-reset-password.ejs' },
                    './views/emails/email-verify-account.ejs': { onlyIf: 'caviar', copy: 'views/emails/email-verify-account.ejs' },
                    './views/emails/email-verify-new-email.ejs': { onlyIf: 'caviar', copy: 'views/emails/email-verify-new-email.ejs' },
                    './views/pages': { folder: {} },
                    './views/pages/homepage.ejs': { copy: 'views/homepage.ejs', overridable: 'homepage' },
                    './views/pages/account': { onlyIf: 'caviar', folder: {} },
                    './views/pages/account/change-password.ejs': { onlyIf: 'caviar', copy: 'views/pages/account/change-password.ejs' },
                    './views/pages/account/my-account.ejs': { onlyIf: 'caviar', copy: 'views/pages/account/my-account.ejs' },
                    './views/pages/account/profile.ejs': { onlyIf: 'caviar', copy: 'views/pages/account/profile.ejs' },
                    './views/pages/contact.ejs': { onlyIf: 'caviar', copy: 'views/pages/contact.ejs' },
                    './views/pages/dashboard': { onlyIf: 'caviar', folder: {} },
                    './views/pages/dashboard/welcome.ejs': { onlyIf: 'caviar', copy: 'views/pages/dashboard/welcome.ejs' },
                    './views/pages/entry': { onlyIf: 'caviar', folder: {} },
                    './views/pages/entry/confirmed-email.ejs': { onlyIf: 'caviar', copy: 'views/pages/entry/confirmed-email.ejs' },
                    './views/pages/entry/forgot-password.ejs': { onlyIf: 'caviar', copy: 'views/pages/entry/forgot-password.ejs' },
                    './views/pages/entry/login.ejs': { onlyIf: 'caviar', copy: 'views/pages/entry/login.ejs' },
                    './views/pages/entry/new-password.ejs': { onlyIf: 'caviar', copy: 'views/pages/entry/new-password.ejs' },
                    './views/pages/entry/signup.ejs': { onlyIf: 'caviar', copy: 'views/pages/entry/signup.ejs' },
                    './views/pages/faq.ejs': { onlyIf: 'caviar', copy: 'views/pages/faq.ejs' },
                    './views/pages/legal': { onlyIf: 'caviar', folder: {} },
                    './views/pages/legal/privacy.ejs': { onlyIf: 'caviar', copy: 'views/pages/legal/privacy.ejs' },
                    './views/pages/legal/terms.ejs': { onlyIf: 'caviar', copy: 'views/pages/legal/terms.ejs' },

                  }//</targets>
                }
              }//</views>
            ],


            // /api
            './api/controllers':          { folder: {} },
            './api/controllers/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },

            './api/controllers/account':  { onlyIf: 'caviar', folder: {} },
            './api/controllers/account/logout.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/logout.js.template' },
            './api/controllers/account/update-billing-card.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/update-billing-card.js.template' },
            './api/controllers/account/update-password.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/update-password.js.template' },
            './api/controllers/account/update-profile.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/update-profile.js.template' },
            './api/controllers/account/view-change-password.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/view-change-password.js.template' },
            './api/controllers/account/view-my-account.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/view-my-account.js.template' },
            './api/controllers/account/view-profile.js':  { onlyIf: 'caviar', copy: 'api/controllers/account/view-profile.js.template' },

            './api/controllers/entry':  { onlyIf: 'caviar', folder: {} },
            './api/controllers/entry/confirm-email.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/confirm-email.js.template' },
            './api/controllers/entry/login.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/login.js.template' },
            './api/controllers/entry/send-password-recovery-email.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/send-password-recovery-email.js.template' },
            './api/controllers/entry/signup.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/signup.js.template' },
            './api/controllers/entry/update-password-and-login.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/update-password-and-login.js.template' },
            './api/controllers/entry/view-forgot-password.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/view-forgot-password.js.template' },
            './api/controllers/entry/view-login.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/view-login.js.template' },
            './api/controllers/entry/view-new-password.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/view-new-password.js.template' },
            './api/controllers/entry/view-signup.js':  { onlyIf: 'caviar', copy: 'api/controllers/entry/view-signup.js.template' },

            './api/controllers/legal':  { onlyIf: 'caviar', folder: {} },
            './api/controllers/legal/view-terms.js':  { onlyIf: 'caviar', copy: 'api/controllers/legal/view-terms.js.template' },

            './api/controllers/misc':  { onlyIf: 'caviar', folder: {} },
            './api/controllers/misc/contact.js':  { onlyIf: 'caviar', copy: 'api/controllers/misc/contact.js.template' },
            './api/controllers/misc/view-homepage.js':  { onlyIf: 'caviar', copy: 'api/controllers/misc/view-homepage.js.template' },

            './api/models':               { folder: {}, overridable: 'api/models' },
            './api/models/.gitkeep':      { copy: '../../../shared-templates/gitkeep.template', overridable: 'api/models/.gitkeep' },
            './api/models/User.js':       { onlyIf: 'caviar', copy: 'api/models/User.js.template' },

            './api/helpers':              { folder: {} },
            './api/helpers/.gitkeep':     { copy: '../../../shared-templates/gitkeep.template' },
            './api/helpers/send-template-email.js': { onlyIf: 'caviar', copy: 'api/helpers/send-template-email.js.template' },

            './api/policies':               { folder: {} },
            './api/policies/isLoggedIn.js': { copy: 'api/policies/isLoggedIn.js' },
            './api/policies/isAdmin.js':    { onlyIf: 'caviar', copy: 'api/policies/isAdmin.js' },

            './api/hooks':                  { onlyIf: 'caviar', folder: {} },
            './api/hooks/custom':           { onlyIf: 'caviar', folder: {} },
            './api/hooks/custom/index.js':  { onlyIf: 'caviar', copy: 'api/hooks/custom/index.js.template' },

            // /config
            './config': { folder: {} },
            './config/blueprints.js': { copy: 'config/blueprints.js' },
            './config/bootstrap.js': { template: 'config/bootstrap.js.template' },
            './config/datastores.js': { copy: 'config/datastores.js', overridable: 'config/datastores.js' },
            './config/globals.js': { template: 'config/globals.js.template' },
            './config/http.js': { copy: 'config/http.js' },
            './config/i18n.js': { copy: 'config/i18n.js' },
            './config/log.js': { copy: 'config/log.js' },
            './config/models.js': { template: 'config/models.js', overridable: 'config/models.js' },
            './config/policies.js': { template: 'config/policies.js.template' },
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

                  './images':                     { folder: {} },
                  './images/.gitkeep':            { onlyIf: 'traditional', copy: '../../../shared-templates/gitkeep.template' },
                  './images/hero-image.png':      { onlyIf: 'caviar', copy: 'assets/images/hero-image.png' },
                  './images/setup-email.png':      { onlyIf: 'caviar', copy: 'assets/images/setup-email.png' },
                  './images/setup-payment.png':      { onlyIf: 'caviar', copy: 'assets/images/setup-payment.png' },
                  './images/setup-customize.png':      { onlyIf: 'caviar', copy: 'assets/images/setup-customize.png' },

                  './styles':                { folder: {} },
                  './styles/importer.less':  { template: 'assets/styles/importer.less.template' },
                  './styles/layout.less':    { onlyIf: 'caviar', copy: 'assets/styles/layout.less.template' },

                  './styles/pages':          { onlyIf: 'caviar', folder: {} },
                  './styles/pages/about.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/about.less' },
                  './styles/pages/account':  { onlyIf: 'caviar', folder: {} },
                  './styles/pages/account/change-password.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/account/change-password.less' },
                  './styles/pages/account/my-account.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/account/my-account.less' },
                  './styles/pages/account/profile.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/account/profile.less' },
                  './styles/pages/contact.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/contact.less' },
                  './styles/pages/entry':  { onlyIf: 'caviar', folder: {} },
                  './styles/pages/entry/confirmed-email.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/entry/confirmed-email.less' },
                  './styles/pages/entry/forgot-password.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/entry/forgot-password.less' },
                  './styles/pages/entry/login.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/entry/login.less' },
                  './styles/pages/entry/new-password.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/entry/new-password.less' },
                  './styles/pages/entry/signup.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/entry/signup.less' },
                  './styles/pages/faq.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/faq.less' },
                  './styles/pages/homepage.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/homepage.less' },
                  './styles/pages/legal':  { onlyIf: 'caviar', folder: {} },
                  './styles/pages/legal/privacy.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/legal/privacy.less' },
                  './styles/pages/legal/terms.less':  { onlyIf: 'caviar', copy: 'assets/styles/pages/legal/terms.less' },
                  './styles/pages/welcome.less': { onlyIf: 'caviar', copy: 'assets/styles/pages/welcome.less' },

                  './styles/styleguide':          { onlyIf: 'caviar', folder: {} },
                  './styles/styleguide/containers.less': { onlyIf: 'caviar', copy: 'assets/styles/styleguide/containers.less' },
                  './styles/styleguide/animations.less': { onlyIf: 'caviar', copy: 'assets/styles/styleguide/animations.less' },
                  './styles/styleguide/buttons.less': { onlyIf: 'caviar', copy: 'assets/styles/styleguide/buttons.less' },
                  './styles/styleguide/colors.less': { onlyIf: 'caviar', copy: 'assets/styles/styleguide/colors.less' },
                  './styles/styleguide/index.less': { onlyIf: 'caviar', copy: 'assets/styles/styleguide/index.less' },

                  './templates':             { folder: {} },
                  './templates/.gitkeep':    { copy: '../../../shared-templates/gitkeep.template' },

                  './js':                    { folder: {} },
                  './js/.gitkeep':           { copy: '../../../shared-templates/gitkeep.template' },
                  './js/cloud.setup.js':     { onlyIf: 'caviar', copy: 'assets/js/cloud.setup.js' },
                  './js/components':         { onlyIf: 'caviar', folder: {} },
                  './js/components/ajax-button.component.js': { onlyIf: 'caviar', copy: 'assets/js/components/ajax-button.component.js' },
                  './js/components/ajax-form.component.js': { onlyIf: 'caviar', copy: 'assets/js/components/ajax-form.component.js' },
                  './js/components/README.md': { onlyIf: 'caviar', copy: 'assets/js/components/README.md' },
                  './js/pages': { onlyIf: 'caviar', folder: {} },
                  './js/pages/account': { onlyIf: 'caviar', folder: {} },
                  './js/pages/account/change-password.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/account/change-password.page.js' },
                  './js/pages/account/my-account.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/account/my-account.page.js' },
                  './js/pages/account/profile.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/account/profile.page.js' },
                  './js/pages/contact.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/contact.page.js' },
                  './js/pages/dashboard': { onlyIf: 'caviar', folder: {} },
                  './js/pages/dashboard/welcome.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/dashboard/welcome.page.js' },
                  './js/pages/entry': { onlyIf: 'caviar', folder: {} },
                  './js/pages/entry/confirmed-email.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/entry/confirmed-email.page.js' },
                  './js/pages/entry/forgot-password.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/entry/forgot-password.page.js' },
                  './js/pages/entry/login.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/entry/login.page.js' },
                  './js/pages/entry/new-password.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/entry/new-password.page.js' },
                  './js/pages/entry/signup.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/entry/signup.page.js' },
                  './js/pages/faq.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/faq.page.js' },
                  './js/pages/homepage.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/homepage.page.js' },
                  './js/pages/legal': { onlyIf: 'caviar', folder: {} },
                  './js/pages/legal/privacy.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/legal/privacy.page.js' },
                  './js/pages/legal/terms.page.js': { onlyIf: 'caviar', copy: 'assets/js/pages/legal/terms.page.js' },

                  './js/utilities': { onlyIf: 'caviar', folder: {} },
                  './js/utilities/is-valid-email-address.js': { onlyIf: 'caviar', copy: 'assets/js/utilities/is-valid-email-address.js' },
                  './js/utilities/README.md': { onlyIf: 'caviar', copy: 'assets/js/utilities/README.md' },

                  './dependencies':          { folder: {} },
                  './dependencies/.gitkeep': { copy: '../../../shared-templates/gitkeep.template' },
                  './dependencies/bootstrap': { onlyIf: 'caviar', folder: {} },
                  './dependencies/bootstrap/css': { onlyIf: 'caviar', folder: {} },
                  './dependencies/bootstrap/css/bootstrap-grid.css': { onlyIf: 'caviar', copy: 'assets/dependencies/bootstrap/css/bootstrap-grid.css' },
                  './dependencies/bootstrap/css/bootstrap-reboot.css': { onlyIf: 'caviar', copy: 'assets/dependencies/bootstrap/css/bootstrap-reboot.css' },
                  './dependencies/bootstrap/css/bootstrap.css': { onlyIf: 'caviar', copy: 'assets/dependencies/bootstrap/css/bootstrap.css' },
                  './dependencies/bootstrap/dependencies': { onlyIf: 'caviar', folder: {} },
                  './dependencies/bootstrap/dependencies/popper.js': { onlyIf: 'caviar', copy: 'assets/dependencies/bootstrap/dependencies/popper.js' },
                  './dependencies/bootstrap/js': { onlyIf: 'caviar', folder: {} },
                  './dependencies/bootstrap/js/bootstrap.js': { onlyIf: 'caviar', copy: 'assets/dependencies/bootstrap/js/bootstrap.js' },
                  './dependencies/cloud.js': { onlyIf: 'caviar', copy: 'assets/dependencies/cloud.js' },
                  './dependencies/jquery.min.js': { onlyIf: 'caviar', copy: 'assets/dependencies/jquery.min.js' },
                  './dependencies/lodash.js': { onlyIf: 'caviar', copy: 'assets/dependencies/lodash.js' },
                  './dependencies/parasails.js': { onlyIf: 'caviar', copy: 'assets/dependencies/parasails.js' },
                  './dependencies/sails.io.js': { onlyIf: 'caviar', copy: 'assets/dependencies/sails.io.js' },
                  './dependencies/vue.js': { onlyIf: 'caviar', copy: 'assets/dependencies/vue.js' },

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
                  './pipeline.js':            { template: 'tasks/pipeline.js.template' },


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
                  './config/babel.js':        { copy: 'tasks/config/babel.js' },

                  './config/watch.js':        { template: 'tasks/config/watch.js.template' },


                  // intermediate grunt tasklists (`tasks/register`)
                  './register/linkAssets.js':          { copy: 'tasks/register/linkAssets.js' },
                  './register/linkAssetsBuild.js':     { copy: 'tasks/register/linkAssetsBuild.js' },
                  './register/linkAssetsBuildProd.js': { copy: 'tasks/register/linkAssetsBuildProd.js' },
                  './register/syncAssets.js':          { copy: 'tasks/register/syncAssets.js' },
                  './register/compileAssets.js':       { copy: 'tasks/register/compileAssets.js' },
                  './register/polyfill.js':            { copy: 'tasks/register/polyfill.js' },


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


