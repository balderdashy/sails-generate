var _ = require('lodash');
var generate = require('root-require')('lib');

generate({
	targets: {
		'.': 'generator'
	}
}, {}, handleOutput());



function handleOutput () {
	var log = new (require('captains-log'))();

	/**
	 * 
	 * @param  {[type]} err    [description]
	 * @param  {[type]} output [description]
	 * @return {[type]}        [description]
	 */
	return function handleOutput (err, output) {
		if (err) {
			var outputFn = _.bind(writeOutput, null, 'error');
			var errOutput = err instanceof Error?
				String(err).replace(/^Error:\s/,'')
				: String(err);
			return _.each(errOutput.split('\n'), outputFn);
		}
		return _.each(output, writeOutput);
	};

	/**
	 * Overridable function to emit output.
	 * 
	 * @param  {String} channel [description]
	 * @param  {[type]} entry [description]
	 * @return {[type]}       [description]
	 */
	function writeOutput (channel, output) {
		channel = channel || 'info';
		log[channel](output);
	}
}