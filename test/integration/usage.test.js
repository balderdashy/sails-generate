var _ = require('lodash');
var generate = require('root-require')('lib');

var scope = {};

generate({
	targets: {
		'.': {
			exec: function (scope, cb) {
				scope.output.push(function () {
					return 'Test A';
				});
				scope.output.push('Current destPath :: '+scope.destPath);
				cb();
			}
		},

		'./erm': {
			targets: {
				'.': {
					exec: function (scope, cb) {
						scope.output.push('Test B');
						scope.output.push('Current destPath :: '+scope.destPath);
						cb();
					}
				},

				'evenDeeper': {
					targets: {
						'.': {
							targets: {
								'.': {
									exec: function (scope, cb) {
										scope.output.push('Test C');
										scope.output.push('Current destPath :: '+scope.destPath);
										cb();
									}
								}
							}
						}
					}
				}
			}
		}
	}
}, scope, function (err) {
	if (err) throw err;
	digestScopeOutput(scope);
});



/**
 * Call `handleScopeOutputEntry` for each item in
 * the scope output queue (e.g. log response)
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
function digestScopeOutput(scope) {
	_.each(scope.output, function (entry) {
		if (typeof entry === 'function') {
			entry = entry(scope);
		}
		handleScopeOutputEntry(entry);
	});
}

/**
 * Overridable function to emit output.
 * 
 * @param  {[type]} entry [description]
 * @return {[type]}       [description]
 */
function handleScopeOutputEntry (entry) {
	console.log(entry);
}