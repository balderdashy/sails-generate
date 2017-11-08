/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var flaverr = require('flaverr');
var IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT = require('../../IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT');


/**
 * before()
 *
 * Runs before this generator begins processing targets.
 *
 * @param  {Dictionary} scope
 * @param  {Function} done
 */

module.exports = function before (scope, done) {

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TIP: To easily experiment with `sails new`, try this:
  //
  // First, start within a sandbox directory and create three folders:
  // ```
  // mkdir minimal
  // mkdir basic
  // mkdir expanded
  // ```
  //
  // Then, in 3 separate terminal tabs, cd into each directory and run one of the
  // following commands in each:
  //
  // ```
  // cd .. && rm -rf minimal && sails new minimal --fast --caviar && echo 'cd-ing in...' && cd minimal || echo 'Failed!  You may need to cd in again by hand...'
  // ```
  //
  // ```
  // cd .. && rm -rf basic && sails new basic --fast --caviar && echo 'cd-ing in...' && cd basic || echo 'Failed!  You may need to cd in again by hand...'
  // ```
  //
  // ```
  // cd .. && rm -rf expanded && sails new expanded --fast --caviar && echo 'cd-ing in...' && cd expanded || echo 'Failed!  You may need to cd in again by hand...'
  // ```
  //
  // Or if you're doing this a whoooole lot, you might try:
  //
  // ```
  // rm -rf ../.tmp-home-for-node-modules && mv node_modules ../.tmp-home-for-node-modules && cd .. && rm -rf expanded && sails new expanded --fast --caviar && mv ./.tmp-home-for-node-modules expanded/node_modules && echo 'cd-ing in...' && cd expanded && git init && git add . && git commit -am "Initial commit." && gls || echo 'Failed!  You may need to cd in again by hand...'
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var args0 = scope.args[0];

  // Use a reasonable default app name
  var defaultAppName = args0;

  // Handle `sails new` being called on the current directory (or with no arguments at all)
  // by using the current directory's base name as the default app name.
  // e.g. `sails new .` or `sails new` inside of `code/myApp` will create an app named `my-app`.
  if (defaultAppName === '.' || defaultAppName === './' || !defaultAppName) {
    defaultAppName = path.basename(process.cwd());
  }
  // Use the base name of the directory that the app will be in as its default name.
  // e.g. `sails new foo/bar/myApp` will create an app named `my-app` in the directory `foo/bar/myApp`.
  defaultAppName = _.kebabCase(path.basename(defaultAppName));


  var author = process.env.USER || 'anonymous node/sails user';

  var owner = author;

  _.defaults(scope, {

    // Specific to new Sails apps
    appName: defaultAppName,
    linker: true,
    adapter: 'sails-disk',
    without: [],
    traditional: true,
    caviar: false,

    // Generic
    // (for any generated Node package)
    IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT: IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT,
    author: author,
    owner: owner,
    year: (new Date()).getFullYear(),
    github: {
      username: author,
      owner: owner
    },
    modules: {},
    website: util.format('https://github.com/%s', owner)
  });

  // Provide a shortcut for generating an extremely minimal Sails app.
  if (scope.minimal) {
    scope.without = ['i18n','orm','sockets','grunt','lodash','async','session','views'];
    scope.frontend = false;
    delete scope.minimal;
  }//ﬁ


  // Handle `caviar` vs. `traditional`
  if (scope.caviar) {
    // `caviar` takes precedence over `traditional` and `minimal`
    scope.traditional = false;

    // Ensure there are no conflicts with disabled features vs. --caviar.
    if (scope.frontend === false || _.intersection(scope.without, ['orm', 'sockets', 'grunt', 'lodash', 'session', 'views']).length > 0) {
      return done(new Error('Invalid usage: Cannot generate a new app with the expanded feature set (`--caviar`) while also excluding some of the dependencies and files that it needs.'));
    }

    // Override targets:
    scope.modules.layout = {
      targets: {
        './': { copy: 'views/caviar-layout.ejs' }
      }
    };
    scope.modules.homepage = {
      targets: {
        './': { copy: 'views/pages/caviar-homepage.ejs' }
      }
    };
    scope.modules['404'] = {
      targets: {
        './': { copy: 'views/404-caviar.ejs' }
      }
    };
    scope.modules['500'] = {
      targets: {
        './': { copy: 'views/500-caviar.ejs' }
      }
    };
  }
  else if (scope.traditional === false) {
    return done(new Error('Invalid usage: Cannot set `traditional: false` without providing some other flag (e.g. `caviar: true`)'));
  }



  // Expand `without` into an array.
  // (assumes it is a comma-separated list)
  if (_.isString(scope.without)) {
    scope.without = scope.without.split(',');

    // Strip empty strings just in case there is a trailing comma.
    scope.without = _.without(scope.without, '');

  }//>-

  // Validate `without`
  if (!_.isArray(scope.without)) {
    return done(new Error('Couldn\'t create a new Sails app.  The provided `without` option (`'+util.inspect(scope.without, {depth:null})+'`) is invalid.'));
  }//-•

  // Reject unrecognized "without" entries
  var LEGAL_WITHOUT_IDENTIFIERS = ['lodash', 'async', 'orm', 'sockets', 'grunt', 'i18n', 'session', 'views'];
  var unrecognizedEntries = _.difference(scope.without, LEGAL_WITHOUT_IDENTIFIERS);
  if (unrecognizedEntries.length > 0) {
    return done(new Error('Couldn\'t create a new Sails app.  The provided `without` option contains '+(unrecognizedEntries.length===1?'an':unrecognizedEntries.length)+' unrecognized entr'+(unrecognizedEntries.length===1?'y':'ies')+': '+unrecognizedEntries));
  }//-•

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Note: An earlier version of `onlyIf` support was implemented here, but
  // then moved into core in f324b8763a7a62510310ea636dc815c0b629f6ad and removed
  // from here in the following commit.
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // --without=views
  //
  // Don't include the `views/` folder or the `config/views.js` file
  if (_.contains(scope.without, 'views')) {
    scope.modules['views'] = false;
    scope.modules['config/views.js'] = false;
    scope.modules['.htmlhintrc'] = false;
  }//-•

  // --without=session
  //
  // Don't include the `config/session.js` file, and don't include policies
  // directory or the policies config file.
  // (while policies work fine without a session, the default policy doesn't
  // make sense without one, and generating an empty folder without a gitkeep
  // would be weird.)
  if (_.contains(scope.without, 'session')) {
    scope.modules['config/session.js'] = false;
    scope.modules['config/policies.js'] = false;
    scope.modules['api/policies'] = false;
  }//-•

  // --without=i18n
  //
  // Don't include the `config/locales/` directory if this is being generated
  // without `i18n`.  Also don't include `config/i18n.js`.
  if (_.contains(scope.without, 'i18n')) {
    scope.modules['config/locales/de.json'] = false;
    scope.modules['config/locales/en.json'] = false;
    scope.modules['config/locales/es.json'] = false;
    scope.modules['config/locales/fr.json'] = false;
    scope.modules['config/i18n.js'] = false;
  }//-•

  // --without=grunt
  //
  // Don't include the `tasks/` directory or Gruntfile.js if this is being generated
  // without `grunt`.  Also don't include `assets/`.
  if (_.contains(scope.without, 'grunt')) {
    scope.modules.grunttasks = false;
    scope.modules.gruntfile = false;
    scope.modules.assets = false;
    scope.modules.layout = {
      targets: {
        './': { copy: 'views/gruntless-layout.ejs' }
      }
    };
  }//-•

  // --without=sockets
  //
  // If this is being generated without `sockets`, do a different, stripped-down homepage instead.
  if (_.contains(scope.without, 'sockets')) {
    scope.modules.homepage = {
      targets: {
        './': { copy: 'views/stripped-down-homepage.ejs' }
      }
    };

    scope.modules['config/sockets.js'] = false;
  }

  // --without=orm
  //
  if (_.contains(scope.without, 'orm')) {
    scope.modules.homepage = {
      targets: {
        './': { copy: 'views/stripped-down-homepage.ejs' }
      }
    };
    scope.modules['config/models.js'] = false;
    scope.modules['config/datastores.js'] = false;
    scope.modules['api/models'] = false;
    scope.modules['api/models/.gitkeep'] = false;

    // Also disable blueprints
    scope.modules['config/blueprints.js'] = false;
  }


  // --------------------------------------------------------------------------------------------------------------
  // > FUTURE: convert this to work based on `--without` instead (e.g. you'd be able to do --without=lodash,async,frontend)
  // (but note this generator needs to be grepped for the word "frontend" first - there are other places in here where `scope.frontend` is used!!!)

  // Alias for `--no-front-end` or `--front-end`
  // (instead of "--no-frontend" or "--frontend")
  if (!_.isUndefined(scope['front-end'])) {
    scope.frontend = scope['front-end'];
    delete scope['front-end'];
  }

  // If this is an app being generated with `--no-frontend` (which is equivalent
  // to `--frontend=false`), then disable some of our targets.
  //
  if (scope.frontend === false) {
    scope.modules.frontend = false;
    scope.modules.gruntfile = false;
    scope.modules.views = false;
    scope.modules.views = false;
    scope.modules['sails.io.js'] = false;
    scope.modules['.htmlhintrc'] = false;
  }//>-
  // --------------------------------------------------------------------------------------------------------------

  // Make changes to the rootPath where the sails project will be created
  scope.rootPath = path.resolve(process.cwd(), args0 || '');

  // Ensure there aren't any insurmountable conflicts at the generator's root path.
  // > This is so that we don't inadvertently delete anything, unless the `force`
  // > flag was enabled.
  (function _ensureNoInsurmountableConflictsAtRootPath(proceed){

    // Try to read a list of the direct children of this directory.
    var dirContents;
    try {

      dirContents = fs.readdirSync(scope.rootPath);

    }
    catch (errFromReadDirSync) {

      switch (errFromReadDirSync.code) {

        // If the directory doesn't exist, no sweat.  (We'll keep going.)
        case 'ENOENT':
          return proceed();

        // If the target path is actually a file, instead of a directory,
        // then we'll check to see if the `force` flag was enabled.  If not,
        // then we'll bail with a fatal error.  But if `force` WAS enabled,
        // then we'll go ahead and continue onwards.
        case 'ENOTDIR':
          if (scope.force) {
            return proceed();
          }//-•
          return proceed(flaverr('alreadyExists', new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because something other than an empty directory already exists at that path.')));

        // Otherwise, there was some other issue, so bail w/ a fatal error.
        default:
          return proceed(new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because an unexpected error occurred: '+errFromReadDirSync.stack));

      }//</switch :: errFromReadDirSync.code>
    }//</catch :: errFromReadDirSync>

    //--•
    // If this directory is empty, then we're good.
    if (dirContents.length === 0){
      return proceed();
    }

    //--•
    // But otherwise, this directory is NOT empty.

    // If the `force` flag is enabled, we can proceed.
    // (Otherwise we have to fail w/ a fatal error.)
    if (scope.force) {
      return proceed();
    } else { return proceed(flaverr('alreadyExists', new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because a non-empty directory already exists at that path.'))); }

  })(function (err){
    if (err) {
      switch (err.code) {
        case 'alreadyExists': return done(err);
        default: return done(err);
      }
    }

    return done();

  });//</self-calling function :: ensure there aren't any insurmountable conflicts at the generator's root path>

};
