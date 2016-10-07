/**
 * Module dependencies
 */

var async = require('async');
var FileHeap = require('./util/FileHeap');

var helpGenerateJsonFile = require('../../lib/helpers/jsonfile');



before(function (cb) {
	var self = this;

	/*
	 * Use an allocator to make it easier to manage files
	 * generated during testing
	 */
	self.heap = new FileHeap();

	/*
	 * Another file allocator made to look like a Sails app
	 * to test behavior with and without `--force`, inside
	 * and outside of a Sails project directory.
	 */
	self.sailsHeap = new FileHeap({
		path: '.tmp/someSailsApp/'
	});
	helpGenerateJsonFile({
		rootPath: self.sailsHeap.alloc('package.json'),
		data: {
			dependencies: {
				sails: '~99.9.99'
			}
		}
	}, { success: cb });

});




after(function (cb) {

	/*
	 * Clean up loose files afterwards
	 */
	async.parallel([
		this.heap.cleanAll,
		this.sailsHeap.cleanAll,
	], cb);
});
