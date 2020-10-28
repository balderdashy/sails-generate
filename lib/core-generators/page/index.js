/**
 * Module dependencies
 */

var path = require('path');
var _ = require('@sailshq/lodash');
var generateFile = require('../../builtins/file');


/**
 * Usage:
 * `sails generate page foo`
 *
 * Or:
 * `sails generate page dashboard/foo`
 */

module.exports = {

  templatesDirectory: path.resolve(__dirname,'./templates'),

  /**
   * Scope:
   * ----------------------------------------------------
   * @option {Array} args   [command-line arguments]
   * ----------------------------------------------------
   * @property {String} relPath
   * @property {String} stem
   * @property {String} newActionSlug
   *
   * @property {String} newViewRelPath
   * @property {String} newActionRelPath
   * @property {String} newStylesheetRelPath
   * @property {String} newPageScriptRelPath
   */

  before: function (scope, exits) {
    if (!scope.args[0]) {
      return exits.error(
        'Please specify the base name or path for the new page.\n'+
        '(relative from the `views/pages/` folder;\n'+
        ' e.g. `dashboard/activity-summary`)'
      );
    }

    // e.g. `dashboard/activity-summary`
    scope.relPath = scope.args[0];

    // Check if it has a file extension and, if so, reject it.
    if (path.extname(scope.relPath)) {
      return exits.error('Please specify the path for the new page, excluding the filename suffix (i.e. no ".ejs")');
    }

    // Trim any whitespace from both sides.
    scope.relPath = _.trim(scope.relPath);

    // Replace backslashes with proper slashes.
    // (This is crucial for Windows compatibility.)
    scope.relPath = scope.relPath.replace(/\\/g, '/');

    // Check that it does not have any trailing slashes.
    if (scope.relPath.match(/\/$/)) {
      return exits.error('Please specify the path for the new page. (No trailing slash please.)');
    }

    // Check that it does not begin with a slash or a dot dot slash.
    // (a single dot+slash is ok, since you might be using tab-completion in the terminal)
    if (scope.relPath.match(/^\.\.+\//) || scope.relPath.match(/^\//)) {
      return exits.error('No need for dots and leading slashes and things. Please specify something like: `dashboard/activity-summary`');
    }

    // Make sure the relative path is not within "pages/", "views/", "controllers/",
    // "assets/", "js/", "styles/", or anything else like that.  If it is, it's probably
    // an accident.  And if it's not an accident, it's still super confusing.
    if (scope.relPath.match(/^(pages\/|views\/|controllers\/|api\/|assets\/|js\/|styles\/)/i)) {
      return exits.error('Please specify *just* the relative path for the new page, excluding prefixes like "pages/", "views/", or "controllers/".  Those will be attached for you automatically-- you just need to include the last bit; e.g. `dashboard/activity-summary` or  `internal/admin-activity-log`');
    }

    // Gracefully ignore double-slashes.
    scope.relPath = scope.relPath.replace(/\/\/+/, '/');

    // Gracefully ignore leading "./", if present.
    scope.relPath = scope.relPath.replace(/^[\.\/]+/, '');

    // Make sure all parent sub-folders are kebab-cased and don't contain any
    // uppercase or non-alphanumeric characters (except dashes are ok, of course).
    var parentSubFoldersString = path.dirname(scope.relPath);
    var arrayOfParentSubFolders = parentSubFoldersString==='.' ? [] : parentSubFoldersString.split(/\//);
    try {
      _.each(arrayOfParentSubFolders, function(subFolderName){
        if (subFolderName !== _.kebabCase(subFolderName)) {
          throw new Error('Please make sure any parent sub-folders are written in kebab-case; e.g. "internal-site/admin-dashboard/foobar", and NOT "internalSite/admin_dashboard/dontDoTHIS/please"');
        }
        if (subFolderName.match(/[^a-z0-9\-]/) || subFolderName !== _.deburr(subFolderName)){
          throw new Error('Please stick to alphanumeric characters and dashes.');
        }
      });//∞
    } catch (err) { return exits.error(err.message); }

    // Tease out the "stem".
    // (e.g. `activity-summary`)
    var stem = path.basename(scope.relPath);

    // Then kebab-case it, if it isn't already.
    // (e.g. `activitySummary` becomes `activity-summary`)
    stem = _.kebabCase(stem);

    // Make sure it doesn't start with `view`.
    // (e.g. NOT `view-activity-summary`)
    if (stem.match(/^view-/)) {
      return exits.error('No need to prefix with "view-" when generating a page.  Instead, just leave that part out.  (It\'ll be added automatically where needed.)');
    }

    // Check that the stem doesn't still contain any uppercase or non-alphanumeric
    // characters.  (Except dashes are ok, of course.)
    if (stem.match(/[^a-z0-9\-]/) || stem !== _.deburr(stem)) {
      return exits.error('Please stick to alphanumeric characters and dashes.');
    }


    // ◊  (Now then…)
    scope.stem = stem;
    scope.newActionSlug = path.join(arrayOfParentSubFolders.join('/'), 'view-'+stem);
    scope.newActionRelPath = path.join('api/controllers/', scope.newActionSlug+'.js');
    scope.newViewRelPath = path.join('views/pages/', scope.relPath+'.ejs');
    scope.newStylesheetRelPath = path.join('assets/styles/pages/', scope.relPath+'.less');
    scope.newPageScriptRelPath = path.join('assets/js/pages/', scope.relPath+'.page.js');

    // Set up underlying "action" generator.
    scope.actions2 = true;
    scope.args = [ scope.newActionSlug ];

    // Disable the "Created a new …!" output so we can use our own instead.
    scope.suppressFinalLog = true;

    return exits.success();
  },

  after: function (scope, done){
    console.log();
    console.log('Successfully generated:');
    console.log(' •-',scope.newViewRelPath);
    console.log(' •-',scope.newActionRelPath);
    console.log(' •-',scope.newStylesheetRelPath);
    console.log(' •-',scope.newPageScriptRelPath);
    console.log();
    console.log('A few reminders:');
    console.log(' (1)  These files were generated assuming your Sails app is using');
    console.log('      Vue.js as its front-end framework.  (If you\'re unsure,');
    console.log('      head over to https://sailsjs.com/support)');
    console.log();
    console.log(' (2)  You\'ll need to manually add a route for this new page\'s');
    console.log('      action in your `config/routes.js` file; e.g.');
    console.log('          \'GET /'+scope.relPath+'\': { action: \''+(
      scope.newActionSlug.replace(/\\/g,'/')//« because Windows
    )+'\' },');
    console.log();
    console.log(' (3)  You\'ll need to manually import the new LESS stylesheet');
    console.log('      from your `assets/styles/importer.less` file; e.g.');
    console.log('          @import \''+(
      path.join('pages/', scope.relPath+'.less').replace(/\\/g,'/')//« because Windows
    )+'\';');
    console.log();
    console.log(' (4)  Last but not least, since some of the above are backend changes,');
    console.log('      don\'t forget to re-lift the server before testing!');
    console.log();

    return done();
  },

  targets: {
    './': ['action'],// << Use underlying default generator
    './:newViewRelPath': {
      // Since we cant use the template builtin for this (due to conflicts
      // with the template used by the .ejs file itself), we just do it
      // inline instead:
      exec: function(scope, done){
        return generateFile({
          rootPath: scope.rootPath,
          force: scope.force,
          contents:
            '<div id="'+scope.stem+'" v-cloak>\n'+
            '\n'+
            '  <h1>TODO: Implement this page.</h1>\n'+
            '  <p>(See also <em>'+scope.newStylesheetRelPath.replace(/\\/g,'/')+'</em>, <em>'+scope.newPageScriptRelPath.replace(/\\/g,'/')+'</em>, and <em>'+scope.newActionRelPath.replace(/\\/g,'/')+'</em>.)</p>\n'+
            /*                                                       ^because Windows                                            ^because Windows                                             ^because Windows */
            '\n'+
            '</div>\n'+
            '<%- /* Expose server-rendered data as window.SAILS_LOCALS :: */ exposeLocalsToBrowser() %>\n'+
            ''
        }, done);
      }
    },
    './:newStylesheetRelPath': { template: 'stylesheet.less.template' },
    './:newPageScriptRelPath': { template: 'page-script.page.js.template' }
  }

};
