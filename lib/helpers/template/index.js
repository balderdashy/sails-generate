/**
 * Module dependencies
 */
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var ejs = require('ejs');
var async = require('async');
var switchback = require('node-switchback');
var FileHelper = require('../file');

//
// TODO: use lodash instead of ejs- reduce weight of deps
//

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
 * @sb.noTemplate
 * @sb.invalid
 */
module.exports = function (options, sb) {
	sb = switchback(sb, {
		alreadyExists: sb.error,
		invalid: sb.error,
		noTemplate: sb.error
	});
	
	// console.log('In templatehelper for :',options.rootPath);

	
	// Compute the canonical path to a template
	// given its relative path from its source generator's
	// `templates` directory.
	var absTemplatePath = path.resolve(options.templatesDirectory, options.templatePath);

	fs.readFile(absTemplatePath, 'utf8', function(err, contents) {
		if (err) {
			err = err instanceof Error ? err : new Error(err);
			err.message = 'Template error: '+err.message;
			err.path = absTemplatePath;
			if (err.code === 'ENOENT') { return sb.noTemplate(err); }
			else return sb(err);
		}
		try {
			contents = ejs.render(contents, options);
		}
		catch(e) { return sb(e); }

		return FileHelper(_.merge(options,{ contents: contents }), sb);
	});
};