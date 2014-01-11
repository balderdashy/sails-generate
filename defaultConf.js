module.exports = {
	
	options: {
		engine: 'ejs',
		linker: true,
		adapter: 'sails-disk'
	},

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
	}

};