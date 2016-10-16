#!/usr/bin/env node

/**
 * Module dependencies
 */

var util = require('util');
var mocha = require('mocha');
var TestRunner = require('waterline-adapter-tests');
var Adapter = require('../../');


/**
 * test/integration/runner.js
 *
 * Run the integration tests.
 *
 * This script uses the `waterline-adapter-tests` module to
 * run mocha tests against the appropriate version of Waterline.
 * Only the interfaces explicitly declared in this adapter's
 * `package.json` file are tested. (e.g. `queryable`, `semantic`, etc.)
 */


// Grab targeted interfaces from this adapter's `package.json` file:
var pkgData = {};
var interfaces = [];
try {
    pkgData = require('../../package.json');
    interfaces = pkgData['waterlineAdapter'].interfaces;
}
catch (e) {
  throw new Error(
    'Could not read supported interfaces from `waterlineAdapter.interfaces`'+'\n' +
    'in this adapter\'s `package.json` file ::' + '\n' +
    e.stack
  );
}





console.log('Testing `' + pkgData.name + '`, a Sails/Waterline adapter.');
console.log('Running `waterline-adapter-tests` against ' + interfaces.length + ' interfaces...');
console.log('( ' + interfaces.join(', ') + ' )');
console.log();
console.log('Latest draft of Waterline adapter interface spec:');
console.log('http://sailsjs.com/docs/concepts/extending-sails/adapters/custom-adapters');
console.log();




// Kick off integration tests.
//
// > This uses the `waterline-adapter-tests` module to
// > run mocha tests against the specified interfaces
// > of the currently-implemented Waterline adapter API.
new TestRunner({

  // Load the adapter module.
  adapter: Adapter,

  // Default adapter config to use.
  config: {
      schema: false
  },

  // The set of adapter interfaces to test against.
  // (grabbed these from this adapter's package.json file above)
  interfaces: interfaces

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Most databases implement 'semantic' and 'queryable'.
  //
  // As of Sails/Waterline v0.10, the 'associations' interface
  // is also available.  If you don't implement 'associations',
  // it will be polyfilled for you by Waterline core.  The core
  // implementation will always be used for cross-adapter / cross-connection
  // joins.
  //
  // These polyfilled implementations can usually be further optimized at the
  // adapter level, since most databases provide optimizations for internal
  // operations.  If possible, you should implement a `join` method to take
  // advantage of native optimizations.  For more on that, talk to an adapter
  // maintainer @ http://sailsjs.com/support.
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // For full interface reference, see:
  // http://sailsjs.com/docs/concepts/extending-sails/adapters/custom-adapters
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

});
