/**
 * Module dependencies
 */

var path = require('path');
var util = require('util');
var _ = require('lodash');
var flaverr = require('flaverr');
var IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT = require('../../IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT');



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

  var GRUNT_DEP_SVR = '1.0.1';
  var SAILS_HOOK_GRUNT_DEP_SVR = '^2.2.1';// ««FUTURE: potential changes here (see https://sailsjs.com/roadmap)

  // List default dependencies used for apps with a frontend
  // > Note: If this app is being generated with --caviar, we shuffle some deps
  // > and include a few extras.
  var declaredDeps = {

    // Sails core
    'sails': sailsSVR,

    // Have to have this if grunt hook is included, because it's required as a local dep
    // in order to use grunt programmatically.  (Hopefully we can change this in Grunt
    // at some point, if you want to help, please contact ben)
    //
    // Note that for caviar, we pull it into the dev dependencies.
    'grunt': !scope.caviar ? GRUNT_DEP_SVR : undefined,

    // External hooks
    'sails-hook-apianalytics': scope.caviar ? '^2.0.0' : undefined,
    'sails-hook-grunt': !scope.caviar ? SAILS_HOOK_GRUNT_DEP_SVR : undefined,//« FUTURE: potential changes here for non-caviar apps too (see https://sailsjs.com/roadmap)
    'sails-hook-organics': scope.caviar ? '^0.13.0' : undefined,//« (formerly `sails-stdlib`)
    'sails-hook-orm': '^2.0.0-16',
    'sails-hook-sockets': '^1.4.0',

    // Production stuff
    'connect-redis': '3.2.0',
    'socket.io-redis': '5.2.0',

    // Lodash
    'lodash': scope.lodashSVR || '3.10.1',

    // Async
    'async': scope.asyncSVR || '2.0.1'

  };


  if(scope.caviar) {
    _.extend(declaredDeps, {



    });
  }//>-

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
    delete declaredDeps['socket.io-redis'];
  }//>-

  // FUTURE: extrapolate session hook

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

      eslint: '4.11.0',

      // Caviar only:  Thanks to the deploy script, these are devDeps instead of
      // normal dependencies:
      grunt: scope.caviar? GRUNT_DEP_SVR: undefined,
      'sails-hook-grunt': scope.caviar? SAILS_HOOK_GRUNT_DEP_SVR: undefined,

    },
    scripts: {
      start:
        'NODE_ENV=production node app.js',
      test: (
        'npm run lint && npm run custom-tests && echo \'Done.\''
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE: Same deal as below:
        // ```
        // './node_modules/sails/bin/test',  # (e.g. same as running `sails test`)
        // ```
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ),
      lint: (
        'node ./node_modules/eslint/bin/eslint . --max-warnings=0 --report-unused-disable-directives && echo \'✔  Your code looks good.\''
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
      ),
      'custom-tests': (
        'echo "(No other custom tests yet.)" && echo'
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
      ),

      // Only include the deploy script if --caviar is in use.
      deploy: (
        scope.caviar?
        'echo \'Warning: This script assumes that this app can be deployed\' && echo \'simply by force-pushing on top of the *deploy* branch.  It will also temporarily use a local *predeploy* branch for preparing assets, that it will delete after it finishes.  Please make sure there is nothing you care about on either of these two branches!!!\' && echo \'\' && echo \'\' && echo \'Let us see if you are ready to deploy...\' && echo \'--\' && git status && echo \'\' && echo \'--\' && echo \'I hope you are on the master branch and have everything pulled and stuff.\' && echo \'Press CTRL+C to cancel.\' && echo \'(you have five seconds)\' && sleep 1 && echo \'...4\' && sleep 1 && echo \'...3\' && sleep 1 && echo \'...2\' && sleep 1 && echo \'...1\' && sleep 1  && echo \'\' && echo \'Alright, here we go.  No turning back now!\' && echo \'Wiping node_modules/ and running npm install...\' && rm -rf node_modules && rm -rf package-lock.json && npm install && (git add package-lock.json && git commit -am \'AUTOMATED COMMIT: Did fresh npm install before deploying, and it caused something relevant (probably the package-lock.json file) to change!  This commit tracks that change.\' || true) && echo \'Deploying as version:\' && npm version patch && echo \'\' && git push origin master && git push --tags && (git branch -D predeploy || true) && git checkout -b predeploy && node node_modules/grunt/bin/grunt buildProd && mv www .www && git add .www && node -e \'sailsrc = JSON.parse(require("fs").readFileSync(\"./.sailsrc\", \"utf8\"));  if (sailsrc.paths&&sailsrc.paths.public !== undefined || sailsrc.hooks&&sailsrc.hooks.grunt !== undefined) { throw new Error("Cannot complete deployment script: .sailsrc file has conflicting contents!  Please throw this midway-complete deployment, away switch back to your original branch, remove the conflicting stuff from .sailsrc, then commit and push that up."); }  sailsrc.paths = sailsrc.paths || {};  sailsrc.paths.public = "./.www";   sailsrc.hooks = sailsrc.hooks || {};  sailsrc.hooks.grunt = false;  require("fs").writeFileSync("./.sailsrc", JSON.stringify(sailsrc))\' && git commit -am \'AUTOMATED COMMIT: Automatically bundling compiled assets as part of deploy, updating the EJS layout and .sailsrc file accordingly.\' && git push origin predeploy && git checkout master && git push origin +predeploy:deploy && git push --tags && git branch -D predeploy && git push origin :predeploy && echo \'\' && echo \'--\' && echo \'OK, done.  It should be live momentarily.\' && echo \'(if you get impatient, check the Heroku dashboard for status)\''
        : undefined
      ),

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // FUTURE: Maybe bring this back as an opt-in thing.
      // (For some users, it is more confusing than it is helpful)
      // ```
      // debug: (
      //   'node debug app.js'
      // )
      // ```
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    },
    main: 'app.js',
    repository: {
      type: 'git',
      url: util.format('git://github.com/%s/%s.git', scope.github.username, scope.appName)
    },
    author: scope.author || '',
    license: scope.license || '',
    engines: {
      node: IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT ? '8' : '6'
    }
  };


  var RX_NODE_MAJOR_DOT_MINOR = /^v([^.]+\.?[^.]+)\./;
  var currentNodeMajorDotMinorVersionAsNumber = +(process.version.match(RX_NODE_MAJOR_DOT_MINOR)[1]);
  if (currentNodeMajorDotMinorVersionAsNumber < 4) {
    console.error();
    console.error('------------------------------------------------------------------------------------------');
    console.error('It looks like your current version of Node.js is '+process.version+'.');
    console.error('We\'re sorry, but to build an app with Sails 1.0 you must use at least Node version 4.');
    console.error('To get the most out of Sails, we recommend Node version 7.9 or greater.');
    console.error();
    console.error(' [?] If you\'re unsure or want advice, swing by https://sailsjs.com/support');
    console.error('------------------------------------------------------------------------------------------');
    throw flaverr({
      name: 'CompatibilityError',
      code: 'E_NODE_VERSION_TOO_LOW',
      message: 'Node version too low (needs Node v4 or greater).'
    });
  }//•

  if(scope.caviar && !IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT) {
    console.error();
    console.error('------------------------------------------------------------------------------------------');
    console.error('It looks like your current version of Node.js is '+process.version+'.');
    console.error('We\'re sorry, but to build on top of Sails 1.0\'s expanded starter app, you must');
    console.error('use Node version 7.9 or greater.  Please upgrade your version of Node, or generate');
    console.error('a traditional Sails app instead.');
    console.error();
    console.error(' [?] If you\'re unsure or want advice, swing by https://sailsjs.com/support');
    console.error('------------------------------------------------------------------------------------------');
    throw flaverr({
      name: 'CompatibilityError',
      code: 'E_NODE_VERSION_TOO_LOW',
      message: 'Node version too low for expanded starter app (needs Node v7.9 or greater).'
    });
  }

  if(!IS_CURRENT_NODE_VERSION_CAPABLE_OF_AWAIT) {
    console.warn();
    console.warn('------------------------------------------------------------------------------------------');
    console.warn('It looks like your current version of Node.js is '+process.version+'.');
    console.warn();
    console.warn('Sails works with all officially-supported versions of Node.js.');
    console.warn('But it works *especially* well with Node versions 7.9 and up.');
    console.warn();
    console.warn('As of Sails v1.0, your app can now take advantage of the new `await` keyword,');
    console.warn('instead of relying on callbacks or promise chaining (`.exec()`, `.then()`, etc.)');
    console.warn('This new feature of Sails/Node.js/JavaScript makes your team more productive,');
    console.warn('and it usually leads to more stable code with fewer bugs.');
    console.warn();
    console.warn('If you choose *not* to upgrade Node.js, you\'ll still be able to use Sails (of course!)');
    console.warn('But we really recommend taking a moment to look into this.  It\'s fast and easy, and ');
    console.warn('we think you\'ll find it helps you build higher quality apps, faster than ever before.');
    console.warn();
    console.warn('Upgrade @ https://sailsjs.com/upgrading');
    console.warn();
    console.warn(' [?] If you\'re unsure or want advice, swing by https://sailsjs.com/support');
    console.warn('------------------------------------------------------------------------------------------');
    console.warn();
  }//ﬁ


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
