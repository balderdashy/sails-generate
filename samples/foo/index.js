/**
 *
 * @type {Generator}
 */
module.exports = {

	/**
	 * File(s)/folder(s) to generate, generators+params to user
	 * @type {Object}
	 */
	targets: {
		'.': {
			exec: function (scope, cb) {
				console.log('exec');
				cb();
			}
		}
	}
};
