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

  //
  // if scope has exceptional config, include it in the rc file:
  // The module to use for each known type of generator
  //

  if (scope['frontend'] === false) {
    sailsrcData.hooks = {};
    sailsrcData.hooks.grunt = false;
  }

  return sailsrcData;

};
