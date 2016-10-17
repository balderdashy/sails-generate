/**
 * Module dependencies
 */

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

  var sailsPkg = scope.sailsPackageJSON || {};

  // To determine the sails dep. to inject in the newly created package.json,
  // use `sails.prerelease` specified in the package.json of Sails itself.
  // If a `prerelease` version no. is not specified, just use `version`
  var sailsVersionDependency = (sailsPkg.sails && sailsPkg.sails.prerelease) || ('^' + sailsPkg.version);

  // List default dependencies used for apps with a frontend
  var dependenciesFrontAndBackend = {
    'ejs': getDependencyVersion(sailsPkg, 'ejs'),
    'grunt': getDependencyVersion(sailsPkg, 'grunt'),
    'grunt-contrib-clean': getDependencyVersion(sailsPkg, 'grunt-contrib-clean'),
    'grunt-contrib-coffee': getDependencyVersion(sailsPkg, 'grunt-contrib-coffee'),
    'grunt-contrib-concat': getDependencyVersion(sailsPkg, 'grunt-contrib-concat'),
    'grunt-contrib-copy': getDependencyVersion(sailsPkg, 'grunt-contrib-copy'),
    'grunt-contrib-cssmin': getDependencyVersion(sailsPkg, 'grunt-contrib-cssmin'),
    'grunt-contrib-jst': getDependencyVersion(sailsPkg, 'grunt-contrib-jst'),
    'grunt-contrib-less': getDependencyVersion(sailsPkg, 'grunt-contrib-less'),
    'grunt-contrib-uglify': getDependencyVersion(sailsPkg, 'grunt-contrib-uglify'),
    'grunt-contrib-watch': getDependencyVersion(sailsPkg, 'grunt-contrib-watch'),
    'grunt-sails-linker': getDependencyVersion(sailsPkg, 'grunt-sails-linker'),
    'grunt-sync': getDependencyVersion(sailsPkg, 'grunt-sync'),
    'include-all': getDependencyVersion(sailsPkg, 'include-all'),
    'rc': getDependencyVersion(sailsPkg, 'rc'),
    'sails': sailsVersionDependency,
    'sails-disk': getDependencyVersion(sailsPkg, 'sails-disk')
  };

  // List default dependencies used for back-end only apps (--no-frontend)
  var dependenciesBackendOnly = {
    'include-all': getDependencyVersion(sailsPkg, 'include-all'),
    'rc': getDependencyVersion(sailsPkg, 'rc'),
    'sails': sailsVersionDependency,
    'sails-disk': getDependencyVersion(sailsPkg, 'sails-disk')
  };

  // Creating default package.json file content
  var defaultPackageJSONContent = {
    name: scope.appName,
    private: true,
    version: '0.0.0',
    description: scope.description || 'a Sails application',
    keywords: [],
    dependencies: (scope['frontend'] === false) ? dependenciesBackendOnly : dependenciesFrontAndBackend,
    scripts: {
      debug: 'node debug app.js',
      start: 'node app.js'
    },
    main: 'app.js',
    repository: {
      type: 'git',
      url: util.format('git://github.com/%s/%s.git', scope.github.username, scope.appName)
    },
    author: scope.author || '',
    license: ''
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

/**
 * getDependencyVersion
 *
 * @param  {Dictionary} packageJSON
 * @param  {String} module
 * @return {String}
 * @api private
 */

function getDependencyVersion(packageJSON, module) {
  return (
    packageJSON.dependencies && packageJSON.dependencies[module] ||
    packageJSON.devDependencies && packageJSON.devDependencies[module] ||
    packageJSON.optionalDependencies && packageJSON.optionalDependencies[module]
  );
}
