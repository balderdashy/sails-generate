module.exports = {
	
	// Configurable misc. options
	options: {
		engine: 'ejs',
		linker: true,
		adapter: 'sails-disk',
		_maxHops: 100
	},

	// This is where generators can push output
	// they'd like to share with the user.
	// i.e. typically in the form of log output
	// (although other transports may be used...
	//  a generator should never console.log directly!)
	output: [],

	// Configurable generator definitions
	modules: {
		
		// App
		new: 'sails-generate-new',

		// App Structure
		backend: 'sails-generate-backend',
		frontend: 'sails-generate-frontend',
		gitigore: 'sails-generate-gitigore',
		packagejson: 'sails-generate-packagejson',
		readme: 'sails-generate-readme',

		// App Module
		model: 'sails-generate-model',
		controller: 'sails-generate-controller',
		api: 'sails-generate-api',
		policy: 'sails-generate-policy',
		response: 'sails-generate-response',
		view: 'sails-generate-view',

		// App Plugins
		adapter: 'sails-generate-adapter',
		generator: 'sails-generate-generator',
		hook: 'sails-generate-hook',
	},


	// starting point
	// (should be overidden as needed in `bootstrap` in generators)
	rootPath: process.cwd(),



	// i.e. command-line arguments
	// 
	// For example, if this is `sails-generate-foo`:
	// `sails generate foo bar`
	// -> args = ['bar']
	// 
	args: [],


	// current recursion depth w/i a generator's target set
	// (useful for preventing infinite loops)
	_depth: 0

};