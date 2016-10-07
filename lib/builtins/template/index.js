/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');
var fsx = require('fs-extra');
var reportback = require('reportback')();
var generateFile = require('../file');



/**
 * Read an `ejs` template, compile it using scope.
 * Then use `file` helper to write it to its destination.
 *
 * @option {String}    rootPath
 * @option {String}    templatePath
 * @option {Boolean}   force[=false]
 *
 * @sb.success
 * @sb.error
 * @sb.alreadyExists
 * @sb.noTemplate
 */

module.exports = function(options, sb) {
  sb = reportback.extend(sb, {
    noTemplate: 'error',
    alreadyExists: 'error'
  });

  // console.log('In templatehelper for :',options.rootPath);


  // Compute the canonical path to a template
  // given its relative path from its source generator's
  // `templates` directory.
  var absTemplatePath = path.resolve(options.templatesDirectory, options.templatePath);

  fsx.readFile(absTemplatePath, 'utf8', function(err, originalTemplate) {
    if (err) {

      // Ensure we have an Error instance.
      err = _.isError(err) ? err : new Error(err);

      // err.message = 'Template error: ' + err.message;
      // err.path = absTemplatePath;
      if (err.code === 'ENOENT') {
        return sb.noTemplate(new Error('No such template exists at `'+absTemplatePath+'`.  Details:'+err.stack));
      }

      return sb(new Error('Template error: '+err.stack));
    }

    //--•

    try {

      var precompiledTemplateFn = _.template(originalTemplate);
      var renderedStr = precompiledTemplateFn(options);

      return generateFile(_.merge(options, {
        contents: renderedStr
      }), sb);

    } catch (e) { return sb(e); }

  });//</fsx.readFile()>

};
