/**
 * Module dependencies
 */
// var util = require('./lib/util');
// var bootstrap = require('./lib/bootstrap');


/**
 * sails-generate-new
 * 
 * New proposed generator specification
 * 
 * @type {Generator}
 */
module.exports = {

	/**
	 * Bootstrap and validate this generator's scope.
	 * @type {[type]}
	 */
	// boostrap: function (scope, sb) {sb();},


	/**
	 * Use the scope to figure out which flavor of each of our subgenerator dependencies to require.
	 * @type {Object}
	 */
	// dependencies: {},

	/**
	 * File(s)/folder(s) to generate, generators+params to user
	 * @type {Object}
	 */
	generate: {
		'api'				: { folder:{} },
		'api/models'		: { folder:{} },
		'api/controllers'	: { folder:{} },
		'api/services'		: { folder:{} },
		'api/adapters'		: { folder:{} },
		'api/blueprints'	: { folder:{} },
		'api/policies'		: { folder:{} },
		'api/responses'		: { folder:{} },
		'config'			: { folder:{} },
		'config/locales'	: { folder:{} },
		'views'				: { folder:{} }
	}
};

