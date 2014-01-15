/**
 * Module dependencies
 */
var _ = require('lodash')
	, fsx = require('fs-extra')
	, report = require('reportback')()
	, FileHelper = require('../file');


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
module.exports = function (options, sb) {
	sb = report.extend({
		alreadyExists: sb.error,
		invalid: sb.error
	});

	fs.readFile(options.templatePath, 'utf8', function(err, contents) {
		if (err) return sb,error(err);
		return FileHelper(_.merge(options, { contents: contents }), sb);
	});
};