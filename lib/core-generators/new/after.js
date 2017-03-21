/**
 * Module dependencies
 */

var _ = require('lodash');
var chalk = require('chalk');
var Process = require('machinepack-process');

// var exec = require('child_process').exec;
// var spawn = require('cross-spawn');
// var async = require('async');
// var fsx = require('fs-extra');


/**
 * after()
 *
 * Runs after this generator has successfully finished
 * processing all of its targets.
 *
 * > Note: if any target fails, then the `error` LC runs instead.
 *
 *
 * @param  {Dictionary}   scope
 *
 *    @required {String}  rootPath
 *              The absolute path of the destination for the copied file.
 *
 *    @required {String}  sailsRoot
 *              The absolute path of the Sails dependency to grab installed
 *              dependencies from.
 *
 *    @required {String}  appName
 *              The name of the Sails app.
 *              (at this point, this is used purely for logging purposes).
 *
 *    @optional {Boolean}   fast[=false]
 *              If enabled, then dependencies for the newly-created app will
 *              will NOT be `npm install`-ed automatically.
 *
 *
 * @param  {Function} cb
 */

module.exports = function afterGenerate(scope, cb) {

  // Validate scope and provide defaults.
  if (_.isUndefined(scope.rootPath) || !_.isString(scope.rootPath)) {
    return cb(new Error('Consistency violation: `rootPath` is a required string.'));
  }
  if (_.isUndefined(scope.sailsRoot) || !_.isString(scope.sailsRoot)) {
    return cb(new Error('Consistency violation: `sailsRoot` is a required string.'));
  }
  if (_.isUndefined(scope.appName) || !_.isString(scope.appName)) {
    return cb(new Error('Consistency violation: `appName` is a required string.'));
  }

  _.defaults(scope, {

    // Whether to skip `npm install`ing deps automatically.
    fast: false
  });



  // Skip installing dependencies if instructed by the `--fast` flag.
  if (scope.fast) {
    cb.log.info('Created a new Sails app `' + scope.appName + '`!');
    console.log(chalk.gray('(you will need to cd in and run `rm -rf node_modules && npm install`)'));
    return cb();
  }//--•


  // Otherwise IWMIH, we'll be automatically installing dependencies from NPM.

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // MAYBE just install the relevant deps.  It's a lot simpler this way.
  // (Note that we can prby just omit `sails`, since it'll automatically use the global version.)
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  cb.log.info('Installing dependencies...');
  console.log(chalk.gray('Press CTRL+C to skip.'));
  console.log(chalk.gray('(but if you do that, you\'ll need to cd in and run `rm -rf node_modules && npm install`)'));

  // Install dependencies.
  Process.executeCommand({
    command: 'npm install',
    dir: scope.rootPath
  }).exec(function (err) {
    if (err) { return cb(err); }

    // SUCCESS!
    cb.log.info('Created a new Sails app `' + scope.appName + '`!');

    return cb();

  });//</ Process.executeCommand>





  // // Get the version of the installed NPM command-line tool, if possible.
  // exec('npm -v', function (err, stdout, stderr) {

  //   var version;
  //   // The strategy for NPM 3+ will always work, regardless of the
  //   // actual NPM version (as long as NPM is installed).  So we
  //   // default to the '3.0.0' strategy if `npm -v` doesn't work
  //   // for some reason.
  //   if (err) {
  //     version = '3.0.0';
  //   }
  //   else {
  //     version = stdout;
  //   }


  //   // Keep track of any non-fatal errors that occur below
  //   // when we try to create symlinks.  This is used for
  //   // logging a warning message at the very end.
  //   var nonFatalErrorsWhenCreatingSymlinks = [];


  //   //  ███╗   ██╗██████╗ ███╗   ███╗    ██╗   ██╗██████╗
  //   //  ████╗  ██║██╔══██╗████╗ ████║    ██║   ██║╚════██╗
  //   //  ██╔██╗ ██║██████╔╝██╔████╔██║    ██║   ██║ █████╔╝
  //   //  ██║╚██╗██║██╔═══╝ ██║╚██╔╝██║    ╚██╗ ██╔╝██╔═══╝
  //   //  ██║ ╚████║██║     ██║ ╚═╝ ██║     ╚████╔╝ ███████╗
  //   //  ╚═╝  ╚═══╝╚═╝     ╚═╝     ╚═╝      ╚═══╝  ╚══════╝
  //   //
  //   //  ┌─    ┌─┐┬─┐  ┌┬┐┬ ┬┌─┐  ╦  ╦╔╗╔╦╔═  ┌─┐┬  ┌─┐┌─┐  ┬ ┬┌─┐┌─┐  ┌─┐┌┐┌┌─┐┌┐ ┬  ┌─┐┌┬┐    ─┐
  //   //  │───  │ │├┬┘   │ ├─┤├┤   ║  ║║║║╠╩╗  ├┤ │  ├─┤│ ┬  │││├─┤└─┐  ├┤ │││├─┤├┴┐│  ├┤  ││  ───│
  //   //  └─    └─┘┴└─   ┴ ┴ ┴└─┘  ╩═╝╩╝╚╝╩ ╩  └  ┴─┘┴ ┴└─┘  └┴┘┴ ┴└─┘  └─┘┘└┘┴ ┴└─┘┴─┘└─┘─┴┘    ─┘
  //   // If this is NPM version 2 or the `link` flag was enabled...
  //   if (version.split('.')[0] <= 2 || scope.link === true) {

  //     // Automatically create symlinks for all of the necessary dependencies
  //     // in the new app's node_modules/ subdirectory:
  //     async.auto({

  //       // Create the node_modules folder
  //       create_node_modules: function (next) {
  //         fsx.mkdir(path.resolve(scope.rootPath, './node_modules'), next);
  //       },

  //       // Create links to all necessary dependencies
  //       dependencies: ['create_node_modules', function (results, next) {

  //         // Read the contents of the newly created package.json file.
  //         var pathToPackageJson = path.resolve(scope.rootPath, './package.json');
  //         fsx.readJson(pathToPackageJson, function (err, pjData){
  //           if (err) { return next(err); }

  //           // Delete the sails dependency--we'll add it separately.
  //           // (it always gets npm linked)
  //           delete pjData.dependencies.sails;

  //           async.parallel(_.map(_.keys(pjData.dependencies), function copyDependency(packageName){

  //             // Make a symlink between the dependency in the sails node_modules folder,
  //             // and the new app's node_modules.
  //             return function _copyDependency(next) {
  //               var srcModulePath = path.resolve(scope.sailsRoot, './node_modules', packageName);
  //               var destModulePath = path.resolve(scope.rootPath, './node_modules', packageName);

  //               // Use the "junction" option for Windows
  //               fsx.symlink(srcModulePath, destModulePath, 'junction', function (symLinkErr) {
  //                 // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
  //                 if (symLinkErr) {
  //                   nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
  //                 }
  //                 // >- but keep going either way.
  //                 return next();
  //               });
  //             };

  //           }), next);//</async.parallel>

  //         });//</fsx.readJson()>

  //       }],//</dependencies>

  //       // Create a link to the sails we used to create the app
  //       create_sails_link: ['create_node_modules', function create_sails_link(results, next) {
  //         fsx.symlink(scope.sailsRoot, path.resolve(scope.rootPath, './node_modules/sails'), 'junction', function (symLinkErr) {
  //           // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
  //           if (symLinkErr) {
  //             nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
  //           }
  //           // but keep going either way.
  //           return next();
  //         });
  //       }]
  //     }, function (err){
  //       if (err) { return cb(err); }

  //       // SUCCESS!
  //       cb.log.info('Created a new Sails app `' + scope.appName + '`!');

  //       // Warn that user needs to run `rm -rf node_modules && npm install`:
  //       if (nonFatalErrorsWhenCreatingSymlinks.length > 0) {
  //         cb.log.warn('Could not create symbolic links in the newly generated `node_modules` folder');
  //         cb.log.warn('(usually this is due to a permission issue on your filesystem)');
  //         cb.log.warn('Before you run your new app, `cd` into the directory and run:');
  //         cb.log.warn('$ rm -rf node_modules/ && npm install');
  //       }
  //       return cb();
  //     });//</async.auto :: link deps (i.e. for npm <=v2 or if `link` flag is enabled)>

  //     return;

  //   }//</if this is npm <= v2>


  //   //  ███╗   ██╗██████╗ ███╗   ███╗    ██╗   ██╗██████╗
  //   //  ████╗  ██║██╔══██╗████╗ ████║    ██║   ██║╚════██╗
  //   //  ██╔██╗ ██║██████╔╝██╔████╔██║    ██║   ██║ █████╔╝
  //   //  ██║╚██╗██║██╔═══╝ ██║╚██╔╝██║    ╚██╗ ██╔╝ ╚═══██╗
  //   //  ██║ ╚████║██║     ██║ ╚═╝ ██║     ╚████╔╝ ██████╔╝
  //   //  ╚═╝  ╚═══╝╚═╝     ╚═╝     ╚═╝      ╚═══╝  ╚═════╝
  //   //  ┌─    ┌┐┌┌─┐┬─┐┌┬┐┌─┐┬    ┌─┐┌─┐┌┐┌   ┬ ┬┬┌┬┐┬ ┬┌─┐┬ ┬┌┬┐  ╦  ╦╔╗╔╦╔═  ┌─┐┬  ┌─┐┌─┐    ─┐
  //   //  │───  ││││ │├┬┘│││├─┤│    │ ┬├┤ │││   ││││ │ ├─┤│ ││ │ │   ║  ║║║║╠╩╗  ├┤ │  ├─┤│ ┬  ───│
  //   //  └─    ┘└┘└─┘┴└─┴ ┴┴ ┴┴─┘  └─┘└─┘┘└┘┘  └┴┘┴ ┴ ┴ ┴└─┘└─┘ ┴   ╩═╝╩╝╚╝╩ ╩  └  ┴─┘┴ ┴└─┘    ─┘
  //   //
  //   // --•
  //   // Otherwise, this is a normal install on NPM v3... so, unfortunately, we'll
  //   // have to actually `npm install` some of the dependencies again locally.
  //   // Luckily, we can still at least symlink the `sails` dependency.  But we can't
  //   // safely symlink the others, at least not yet.
  //   //
  //   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //   // > If you work on NPM, or if you've dealt with this problem before and have
  //   // > feedback on how to make `sails new` run faster on NPM v3, PLEASE let someone
  //   // > from the core team know- we could use your help!
  //   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //   async.auto({

  //     // Create the node_modules folder
  //     create_node_modules: function create_node_modules(proceed) {
  //       fsx.mkdir(path.resolve(scope.rootPath, './node_modules'), proceed);
  //     },

  //     // Create a link to the sails we used to create the app
  //     create_sails_link: ['create_node_modules', function create_sails_link(results, proceed) {
  //       fsx.symlink(scope.sailsRoot, path.resolve(scope.rootPath, './node_modules/sails'), 'junction', function (symLinkErr) {
  //         // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
  //         if (symLinkErr) {
  //           nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
  //         }
  //         // but keep going either way.
  //         return proceed();
  //       });
  //     }],

  //     // Install other dependencies with NPM
  //     install_other_deps: ['create_sails_link', function (results, proceed) {
  //       console.log(
  //         '=====================================================\n'+
  //         'You seem to be using NPM >= v3.0.0, which no longer\n'+
  //         'supports symbolic links in the `node_modules/` folder.\n'+
  //         '\n'+
  //         'Because of this, creating your new Sails app will\n'+
  //         'take longer than you might be used to. Please bear\n'+
  //         'with us; or if you have a need for speed, downgrade\n'+
  //         'to NPM v2 in the mean time.  Thanks!\n'+
  //         '\n'+
  //         'For more info about downgrading to NPM v2, see:\n'+
  //         'https://github.com/npm/npm/issues/10214\n'+
  //         '====================================================='+
  //         '\n'+
  //         'Installing dependencies... (this could take a little while)'
  //       );

  //       var npmInstall = spawn('npm', ['install'], {cwd: scope.rootPath, stdio: 'inherit'});
  //       npmInstall.on('close', proceed);
  //     }]

  //   }, function (err) {
  //     if (err) { return cb(err); }

  //     // SUCCESS!
  //     cb.log.info('Created a new Sails app `' + scope.appName + '`!');

  //     // Warn that user needs to run `rm -rf node_modules && npm install`:
  //     if (nonFatalErrorsWhenCreatingSymlinks.length > 0) {
  //       cb.log.warn('Could not create symbolic links in the newly generated `node_modules` folder');
  //       cb.log.warn('(usually this is due to a permission issue on your filesystem)');
  //       cb.log.warn('Before you run your new app, `cd` into the directory and run:');
  //       cb.log.warn('$ rm -rf node_modules/ && npm install');
  //     }
  //     return cb();
  //   });//</async.auto :: install deps for npm 3>

  // });//</child_process.exec :: `npm -v`)>

};
