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
 * @cb.success
 * @cb.error
 * @cb.alreadyExists
 * @cb.invalid
 */

module.exports = function(options, cb) {
  cb = reportback.extend(cb, {
    alreadyExists: 'error',
    invalid: 'error'
  });

  // Compute the canonical path to copy from
  // given its relative path from its source generator's
  // `templates` directory.
  var absSrcPath = path.resolve(options.templatesDirectory, options.templatePath);

  fsx.readFile(absSrcPath, function(err, contents) {
    if (err) { return cb.error(err); }

    return generateFile(_.merge(options, {
      contents: contents
    }), cb);

  });

};
