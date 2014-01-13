/**
 * Module dependencies
 */
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var ejs = require('ejs');
var async = require('async');
var switchback = require('node-switchback');

var FileHelper = require('root-require')('lib/helpers/file');

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
		invalid: sb.error
	});

	fs.readFile(options.templatePath, 'utf8', function(err, contents) {
		if (err) {
			err.path = options.templatePath;
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