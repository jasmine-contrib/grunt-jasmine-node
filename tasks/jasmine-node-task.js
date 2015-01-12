module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask("jasmine_node", "Runs jasmine-node.", function() {
    var jasmine = require('jasmine-node');
    var util = require('util');

    // Build all of the options
    var options = this.options({
      forceExit: false
    }, jasmine.defaults);

    options.specFolders = this.filesSrc;
    if (options.projectRoot) {
      options.specFolders.push(options.projectRoot);
    }

    // Tell grunt this task is asynchronous.
    var done = this.async();

    // Check if we should use verbose mode
    // Embedded option should always win over grunt verbose flag
    options.verbose = !!options.verbose || grunt.option('verbose');

    if (options.coffee) {
      options.extensions += "|coffee|litcoffee";
    }

    options.watchFolders = options.watchFolders || [];

    options.onComplete = function() {
      var exitCode;
      util.print('\n');
      if (global.jasmineResult.fail) {
        exitCode = 1;
      } else {
        exitCode = 0;

        if (options.forceExit) {
          process.exit(exitCode);
        }
      }
      global.jasmine.currentEnv_ = undefined;
      done(exitCode === 0);
    };

    try {
      jasmine.run(options);
    } catch (e) {
      console.log('Failed to execute "jasmine.run": ' + e.stack);
    }

  });
};