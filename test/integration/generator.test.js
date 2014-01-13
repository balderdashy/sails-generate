var _ = require('lodash');
var generate = require('root-require')('lib');

generate({
	targets: {
		'.': 'generator'
	}
}, {
	args: ['foo']
}, logReporter());






/**
 * Log reporter
 */
function logReporter () {
	var log = new (require('captains-log'))();

	/**
	 * 
	 * @param  {[type]} err    [description]
	 * @param  {[type]} output [description]
	 * @return {[type]}        [description]
	 */
	return function (err, output) {
		if (err) {
			var errOutput = err instanceof Error?
				String(err).replace(/^Error:\s/,'')
				: String(err);
			return _.each(errOutput.split('\n'), function (item) {log.error(item);});
		}
		return _.each(output, function(item) {log.info(item);});
	};
}