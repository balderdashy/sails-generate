/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');
var fsx = require('fs-extra');
var reportback = require('reportback')();
var generateFile = require('../file');



/**
 * Copy file from one place to another.
 *
 * @option {String}    rootPath
 * @option {String}    templatePath
 * @option {Boolean}   force[=false]
 *
 * @sb.success
 * @sb.error
 * @sb.alreadyExists
 * @sb.invalid
 */

module.exports = function(options, sb) {
  sb = reportback.extend(sb, {
    alreadyExists: 'error',
    invalid: 'error'
  });

  // Compute the canonical path to copy from
  // given its relative path from its source generator's
  // `templates` directory.
  var absSrcPath = path.resolve(options.templatesDirectory, options.templatePath);

  // Note that we don't read in the file as utf8 here,
  // since it's not necessarily text (e.g. could be a binary file)
  fsx.readFile(absSrcPath, function(err, contents) {
    if (err) { return sb.error(err); }

    generateFile({
      rootPath: options.rootPath,
      contents: options.contents,
      force: options.force,
      dry: options.dry
    }, sb);

  });//</fsx.readFile>

};
