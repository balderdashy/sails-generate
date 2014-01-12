/**
 * Module dependencies
 */
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var switchback = require('node-switchback');




/**
 * Generate a folder
 *
 * @option {String} rootPath
 * @option {Boolean} gitkeep
 * [@option {Boolean} force=false]
 *
 * @handlers [success]
 * @handlers alreadyExists
 * @handlers invalid
 * @handlers error
 */
module.exports = function ( options, handlers ) {

	// Provide default values for handlers
	handlers = switchback(handlers, {
		error: handlers.error,
		alreadyExists: handlers.error
	});

	// Provide defaults and validate required options
	_.defaults(options, {
		force: false,
		gitkeep: false
	});
	var missingOpts = _.difference([
		'rootPath'
	], Object.keys(options));
	if ( missingOpts.length ) return handlers.invalid(missingOpts);


	var rootPath = path.resolve( process.cwd() , options.rootPath );

	
	// Only override an existing folder if `options.force` is true
	fs.lstat(rootPath, function(err, inodeStatus) {
		var exists = !(err && err.code === 'ENOENT');
		if (exists && err) return handlers.error(err);

		if (exists && !options.force) {
			return handlers.alreadyExists(rootPath);
		}
		if (exists) {
			fs.remove(rootPath, function deletedOldINode(err) {
				if (err) return handlers.error(err);
				_afterwards_();
			});
		} else _afterwards_();

		function _afterwards_() {
			
			// Don't actually write the directory if this is a dry run.
			if (options.dry) return handlers.success();

			// Create the directory
			fs.mkdirs(rootPath, function directoryWasWritten(err) {
				if (err) return handlers.error(err);
				// console.log('created dir at :::: ',rootPath);
				return handlers.success();
			});
		}
	});
};
