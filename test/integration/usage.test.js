var generate = require('root-require')('generate');

generate({
	targets: {
		'.': {
			exec: function (scope, cb) {
				scope.output.push(function () {
					return 'done';
				});
				cb();
			}
		}
	}
},
{}, console.log);