var _ = require('lodash');
var generate = require('../lib');



var sails = require('sails');


sails.load({
  loadHooks: ['moduleloader', 'userconfig']
}, function(err) {

  if (err) {
    throw err;
  }


  generate({
    targets: {
      '.': 'new'
    }
  }, {
    sails: sails,
    rootPath: process.cwd() + '/.foo'
  }, function (err, output) {
    if (err) {
      console.log('Error:', err);
      return;
    }

    console.log(output);

  });//</generate>

});//</sails.load>
