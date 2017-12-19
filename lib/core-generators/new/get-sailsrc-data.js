/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * getSailsrcData()
 *
 * Get the data that will be encoded in the
 * newly-generated `.sailsrc` file.
 *
 * @param  {Dictionary} scope
 * @returns {Dictionary}
 */

module.exports = function getSailsrcData(scope) {

  var sailsrcData = {};
  sailsrcData.generators = {};
  sailsrcData.generators.modules = {};

  // Include a special programmatically-parseable indication of what versions
  // of sails and sails-generate this app was generated with.
  // (Useful for debugging and upgrade tools)
  //
  // > Please do not rely on this in userland code!  It is experimental and
  // > could change at any time-- it is only provided to help people out, not
  // > for re-use in other things.)
  sailsrcData._generatedWith = {
    'sails': scope.generatedWithSailsVersion,
    'sails-generate': scope.generatedWithSailsGenerateVersion
  };

  // Handle --no-frontend
  // (with special caveat for case where it's being used simultaneously with --without=grunt)
  if (scope['frontend'] === false) {
    sailsrcData.hooks = sailsrcData.hooks||{};
    // Also disable the grunt hook in the .sailsrc file if it wasn't explicitly
    // omitted using `--without`.
    if (!_.contains(scope.without||[], 'grunt')) {
      sailsrcData.hooks.grunt = false;
    }
  }

  // Disable pubsub hook if --without=sockets or --without=orm
  if (_.contains(scope.without||[], 'sockets') || _.contains(scope.without||[], 'orm')){
    sailsrcData.hooks = sailsrcData.hooks||{};
    sailsrcData.hooks.pubsub = false;
  }//ﬁ

  // Disable blueprints hook if --without=orm
  if (_.contains(scope.without||[], 'orm')){
    sailsrcData.hooks = sailsrcData.hooks||{};
    sailsrcData.hooks.blueprints = false;
  }//ﬁ

  // Handle --without items that don't have federated hooks.
  if (_.contains(scope.without||[], 'session')){
    sailsrcData.hooks = sailsrcData.hooks||{};
    sailsrcData.hooks.session = false;
  }//ﬁ
  if (_.contains(scope.without||[], 'views')){
    sailsrcData.hooks = sailsrcData.hooks||{};
    sailsrcData.hooks.views = false;
  }//ﬁ
  if (_.contains(scope.without||[], 'i18n')){
    sailsrcData.hooks = sailsrcData.hooks||{};
    sailsrcData.hooks.i18n = false;
  }//ﬁ

  return sailsrcData;

};
