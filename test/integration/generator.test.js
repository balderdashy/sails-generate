var _ = require('lodash');
var generate = require('../../lib');



generate({
  targets: {
    '.': 'generator'
  }
}, {
  generatorName: 'foobarbar'
}, logReporter());






/**
 * Log reporter
 */
function logReporter () {

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
      return _.each(errOutput.split('\n'), function (item) {console.log('error:',item);});
    }
    return _.each(output, function(item) {console.log('info:',item);});
  };
}
