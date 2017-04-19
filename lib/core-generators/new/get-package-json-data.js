/**
 * Module dependencies
 */

var path = require('path');
var util = require('util');
var _ = require('lodash');



/**
 * getPackageJsonData()
 *
 * Get the data that will be encoded in the
 * newly-generated `package.json` file.
 *
 * @param  {Dictionary} scope
 * @returns {Dictionary}
 */
module.exports = function getPackageJsonData(scope) {

  var sailsPkg;
  if (_.isObject(scope.sailsPackageJSON)) {
    sailsPkg = scope.sailsPackageJSON;
  }
  else if (_.isString(scope.sailsRoot)) {
    sailsPkg = require(path.resolve(scope.sailsRoot, 'package.json'));
  }
  else {
    throw new Error('Could not load package.json from Sails itself.  Make sure either `sailsPackageJSON` or `sailsRoot` are being passed in to `sails-generate`.');
  }

  // To determine the SVR for the sails dep. in the newly created package.json file,
  // base it off of the `version` specified in the package.json of Sails itself.
  var sailsSVR = '^' + sailsPkg.version;


  // List default dependencies used for apps with a frontend
  var declaredDeps = {

    // Sails core
    'sails': sailsSVR,

    // Have to have this if grunt hook is included, because it's required as a local dep
    // in order to use grunt programmatically.  (Hopefully we can change this in Grunt
    // at some point, if you want to help, please contact ben)
    'grunt': '1.0.1',

    // External hooks
    'sails-hook-orm': '^2.0.0-16',
    'sails-hook-sockets': '^1.4.0',
    'sails-hook-grunt': '^2.0.0',

    // Lodash
    'lodash': scope.lodashSVR || '3.10.1',

    // Async
    'async': scope.asyncSVR || '2.0.1'

  };


  // If this is an app being generated with `--without=lodash`, then exclude the Lodash dep.
  if (_.contains(scope.without, 'lodash')) {
    delete declaredDeps.lodash;
  }//>-

  // If this is an app being generated with `--without=async`, then exclude the Lodash dep.
  if (_.contains(scope.without, 'async')) {
    delete declaredDeps.async;
  }//>-

  // If this is an app being generated with `--without=orm`, then exclude the Lodash dep.
  if (_.contains(scope.without, 'orm')) {
    delete declaredDeps['sails-hook-orm'];
  }//>-

  // If this is an app being generated with `--without=sockets`, then exclude the Lodash dep.
  if (_.contains(scope.without, 'sockets')) {
    delete declaredDeps['sails-hook-sockets'];
  }//>-

  // If this is an app being generated with `--without=grunt`, then exclude the Lodash dep.
  if (_.contains(scope.without, 'grunt')) {
    delete declaredDeps['sails-hook-grunt'];
    delete declaredDeps.grunt;
  }//>-


  // If this is an app being generated with `--no-frontend`, then include only
  // the bare minimum, esp. excluding grunt and all grunt-related dependencies.
  if (scope.frontend === false) {
    declaredDeps = _.pick(declaredDeps, [
      'sails',
      'sails-hook-orm',
      'sails-hook-sockets',
      'lodash',
      'async'
    ]);
  }//>-

  // Creating default package.json file content
  var defaultPackageJSONContent = {
    name: scope.appName,
    private: true,
    version: '0.0.0',
    description: scope.description || 'a Sails application',
    keywords: [],
    dependencies: declaredDeps,
    devDependencies: {
      eslint: '3.5.0'// << FUTURE: Remove that once there's a better error message about it.
    },
    scripts: {
      start:
        'NODE_ENV=production node app.js',
      test:
        'npm run lint && npm run custom-tests && echo \'Done.\'',
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE: Same deal as below:
        // ```
        // './node_modules/sails/bin/test',  # (e.g. same as running `sails test`)
        // ```
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      lint:
        'node ./node_modules/eslint/bin/eslint . --max-warnings=0 && echo \'✔  Your code looks good.\'',
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE: Set up something like:
        // ```
        // './node_modules/sails/bin/lint',  # (e.g. same as running `sails lint`)
        // ```
        // In order to do all this:  (without cluttering up the default package.json)
        // ```
        // 'echo && '+
        // 'echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * " && '+
        // 'echo "Verifying code quality..." && '+
        // 'echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * " && '+
        // 'echo && '+
        // 'if ! node ./node_modules/eslint/bin/eslint.js -v '+
        // '; then '+
        //   'echo && '+
        //   'echo && '+
        //   'echo "- - -" && '+
        //   'echo "✘  Could not check code quality." && '+
        //   'echo "Looks like something went wrong trying to access \'eslint\'." && '+
        //   'echo "|  If you are not sure what to do next, try:" && '+
        //   'echo "|  npm install eslint --save-dev --save-exact" && '+
        //   'echo "|  " && '+
        //   'echo "|  And then give this another go:" && '+
        //   'echo "|  npm test" && '+
        //   'echo &&'+
        //   'exit 1'+
        // '; else '+
        //   'npm run lint && '+
        //   'echo && '+
        //   'node ./node_modules/eslint/bin/eslint . --max-warnings=0 && '+
        //   'echo \'✔  OK!\' && '+
        //   'echo'+
        // '; fi && '+
        // 'echo',
        // ```
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      'custom-tests':
        'echo "(No other custom tests yet.)" && echo',
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE: Same deal here:
        // ```
        // './node_modules/sails/bin/test',  # (e.g. same as running `sails test custom`)
        // ```
        // For this stuff:
        // ```
        // 'echo && '+
        // 'echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * " && '+
        // 'echo "Running custom tests..." && '+
        // 'echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * " && '+
        // 'echo && '+
        // 'echo && '+
        // 'echo "- - -" && '+
        // 'echo "✘  Could not run custom tests." && '+
        // 'echo "No custom tests are set up for this project yet." && '+
        // 'echo "|  To set up your own tests for your API, replace the \'custom-tests\' script" && '+
        // 'echo "|  in your package.json file so that it runs Mocha and/or Postman instead of logging" && '+
        // 'echo "|  this message." && '+
        // 'echo &&'+
        // 'exit 1',
        // ```
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      debug:
        'node debug app.js'
    },
    main: 'app.js',
    repository: {
      type: 'git',
      url: util.format('git://github.com/%s/%s.git', scope.github.username, scope.appName)
    },
    author: scope.author || '',
    license: scope.license || '',
  };

  //
  // Check for `packageJson` configuration
  //

  if (scope.packageJson && _.isObject(scope.packageJson)) {
    //
    // Adding new dependencies to package.json
    //
    _.merge(defaultPackageJSONContent, (scope.packageJson || {}));

    //
    // Remove dependencies that has false as version
    // If somebody don't need dependency it could be removed using passing to scope:
    //
    // ```
    // packageJson: {
    //    dependencies: {
    //      ejs: false
    //    }
    // }
    // ```
    //
    if (scope.packageJson.dependencies) {
      defaultPackageJSONContent.dependencies = _.omit(defaultPackageJSONContent.dependencies, function(value) {
        return value === false;
      });
    }
  }

  return _.defaults(scope.appPackageJSON || {}, defaultPackageJSONContent);
};
