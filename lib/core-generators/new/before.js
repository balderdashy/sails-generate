/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


/**
 * before()
 *
 * Runs before this generator begins processing targets.
 *
 * @param  {Dictionary} scope
 * @param  {Function} done
 */

module.exports = function before (scope, done) {

  var args0 = scope.args[0];

  // Use a reasonable default app name
  var defaultAppName = args0;

  // Ensure that default app name is not "." or "" and does not contain slashes.
  if (defaultAppName === '.' || defaultAppName === './' || !defaultAppName) {
    defaultAppName = path.basename(process.cwd());
  }
  defaultAppName = defaultAppName.replace(/\//, '-');


  var author = process.env.USER || 'anonymous node/sails user';

  var owner = author;

  _.defaults(scope, {
    appName: defaultAppName,
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

  // Allow for alternate --no-front-end cli option
  if (scope['front-end'] === false) {
    scope['frontend'] = false;
  }

  if (scope['frontend'] === false) {
    scope.modules['frontend'] = false;
    scope.modules['gruntfile'] = false;
    scope.modules['views'] = false;
  }

  // TODO: deprecate this environment variable (just use scope instead)
  if (process.env.SAILS_NEW_LINK && scope.link !== false) {
    scope.link = true;
  }

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
    catch (err_fromReadDirSync) {

      switch (err_fromReadDirSync.code) {

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
          return proceed(new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because something other than an empty directory already exists at that path.'));

        // Otherwise, there was some other issue, so bail w/ a fatal error.
        default:
          return proceed(new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because an unexpected error occurred: '+err_fromReadDirSync.stack));

      }//</switch :: err_fromReadDirSync.code>
    }//</catch :: err_fromReadDirSync>

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
    } else { return proceed(new Error('Couldn\'t create a new Sails app at "'+scope.rootPath+'" because a non-empty directory already exists at that path.')); }

  })(function (err){
    if (err) { return done(err); }

    return done();

  });//</self-calling function :: ensure there aren't any insurmountable conflicts at the generator's root path>

};
