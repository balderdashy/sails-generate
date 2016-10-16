/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


// On initial require of this file:
//
// • Determine abs path to templates folder.
var TEMPLATES_PATH = path.resolve(__dirname,'./templates');
//
// • Fetch static template string for attr def, and precompile it into a template function.
var ATTR_DEF_TEMPLATE_PATH = path.resolve(TEMPLATES_PATH, './attribute.template');
var ATTR_DEF_TEMPLATE_STR = fs.readFileSync(ATTR_DEF_TEMPLATE_PATH, 'utf8');
var ATTR_DEF_TEMPLATE_FN = _.template(ATTR_DEF_TEMPLATE_STR);



/**
 * sails-generate-model
 *
 * Usage:
 * `sails generate model <resource>`
 *
 * @type {Dictionary}
 */
module.exports = {


	templatesDirectory: TEMPLATES_PATH,


	targets: {

		'./api/models/:filename': { template: 'model.template' }

	},


  /**
   * This `before()` function is run before generating targets.
   * It validates user input, configures defaults, gets extra
   * dependencies, etc.
   *
   * @param  {Dictionary} scope
   * @param  {Function} sb    [callback]
   */
  before: function(scope, sb) {

    // Make sure we're in the root of a Sails project.
    var pathToPackageJSON = path.resolve(scope.rootPath, 'package.json');
    var package, invalidPackageJSON;
    try {
      package = require(pathToPackageJSON);
    } catch (e) {
      invalidPackageJSON = true;
    }

    if (invalidPackageJSON) {
      return sb.invalid('Sorry, this command can only be used in the root directory of a Sails project.');
    }

    // scope.args are the raw command line arguments.
    //
    // e.g. if you run:
    // sails generate controlller user find create update
    // then:
    // scope.args = ['user', 'find', 'create', 'update']
    //
    _.defaults(scope, {
      id: _.capitalize(scope.args[0]),
      attributes: scope.args.slice(1)
    });

    if (!scope.rootPath) {
      return sb.invalid('Usage: sails generate model <modelname> [attribute|attribute:type ...]');
    }
    if (!scope.id) {
      return sb.invalid('Usage: sails generate model <modelname> [attribute|attribute:type ...]');
    }


    // Validate optional attribute arguments
    var attributes = scope.attributes || [];
    var invalidAttributes = [];
    attributes = _.map(attributes, function(attribute, i) {

      var parts = attribute.split(':');

      if (parts[1] === undefined) {
        parts[1] = 'string';
      }

      // Handle invalidAttributes
      if (!parts[1] || !parts[0]) {
        invalidAttributes.push(
          'Invalid attribute notation:   "' + attribute + '"');
        return;
      }
      return {
        name: parts[0],
        type: parts[1]
      };

    });

    // Handle invalid action arguments
    // Send back invalidActions
    if (invalidAttributes.length) {
      return sb.invalid(invalidAttributes);
    }

    // Make sure there aren't duplicates
    if (_.uniq(_.pluck(attributes, 'name')).length !== attributes.length) {
      return sb.invalid('Duplicate attributes not allowed!');
    }

    //
    // Determine default values based on the
    // available scope.
    //
    _.defaults(scope, {
      globalId: _.capitalize(scope.id),
      ext: (scope.coffee) ? '.coffee' : '.js',
    });

    // Take another pass to take advantage of
    // the defaults absorbed in previous passes.
    _.defaults(scope, {
      filename: scope.globalId + scope.ext,
      lang: scope.coffee ? 'coffee' : 'js',
    });



    //
    // Transforms
    //

    // Render some stringified code from the action template
    var compiledAttrDefs = _.map(attributes, function (attrDef) {
      return _.trimRight(
        ATTR_DEF_TEMPLATE_FN({
          name: attrDef.name,
          type: attrDef.type,
          lang: scope.coffee ? 'coffee' : 'js'
        })
      );
    });

    // Then join it all together and make it available in our scope
    // for use in our targets.
    scope.attributes = compiledAttrDefs.join((scope.coffee) ? '\n' : ',\n');

    // Trigger callback with no error to proceed.
    return sb();

  }//</before>

};

