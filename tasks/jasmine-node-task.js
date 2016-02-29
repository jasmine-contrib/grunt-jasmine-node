module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');
      var util;
      try {
          util = require('util');
      } catch(e) {
          util = require('sys');
      }

      var gruntOptions = this.options({
        projectRoot: ".",
        specFolders: [],
        source: "src",
        specNameMatcher: "spec",
        teamcity: false,
        useRequireJs: false,
        extensions: "js",
        match: ".",
        matchall: false,
        autotest: false,
        useHelpers: false,
        forceExit: false,
        useCoffee: false,
        captureExceptions: false,
        growl: false,
        junitreport: {},

        includeStackTrace: false,
        isVerbose: false,
        showColors: false
      });

      // if (gruntOptions.projectRoot) {
        // gruntOptions.specFolders.push(gruntOptions.projectRoot);
      // }
      

      var onComplete = function(runner, log) {
        var exitCode;
        console.log('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (options.forceExit) {
            process.exit(exitCode);
          }
        }
        jasmine.getGlobal().jasmine.currentEnv_ = undefined;
        done(exitCode === 0);
      };

      var options = {
        match:                  gruntOptions.match,
        matchall:               gruntOptions.matchall,
        specNameMatcher:        gruntOptions.specNameMatcher,
        extensions:             gruntOptions.extensions,
        specFolders:            gruntOptions.specFolders,
        onComplete:             gruntOptions.onComplete,
        isVerbose:              gruntOptions.isVerbose,
        showColors:             gruntOptions.showColors,
        teamcity:               gruntOptions.teamcity,
        useRequireJs:           gruntOptions.useRequireJs,
        coffee:                 gruntOptions.useCoffee,
        junitreport:            gruntOptions.junitreport,
        growl:                  gruntOptions.growl,
        includeStackTrace:      gruntOptions.includeStackTrace
      };

      var regExpSpec = new RegExp(options.match + (options.matchall ? "" : options.specNameMatcher + "\\.") + "(" + options.extensions + ")$", 'i');
      options.regExpSpec = regExpSpec;

      options.specFolders = grunt.util._.union(options.specFolders, this.filesSrc);
      if (options.projectRoot) {
        options.specFolders.push(options.projectRoot);
      }
      // Tell grunt this task is asynchronous.
      var done = this.async();

      if(options.coffee){
        options.extensions = 'js|coffee|litcoffee';
        require('coffee-script');
      }




      if (gruntOptions.captureExceptions) {
        // Grunt will kill the process when it handles an uncaughtException, so
        // we need to insert a new handler before the Grunt handler to print
        // out the error stack trace.
        var handlers = process.listeners('uncaughtException');
        process.removeAllListeners('uncaughtException');
        handlers.unshift(function(e) {
          grunt.log.error('Caught unhandled exception: ' + e.toString());
          grunt.log.error(e.stack);
        });
        handlers.forEach(function(handler) {
          process.on('uncaughtException', handler);
        });
      }

      // order is preserved in node.js
      var legacyArguments = Object.keys(options).map(function(key) {
        return options[key];
      });

      if (gruntOptions.useHelpers) {
        jasmine.loadHelpersInFolder(gruntOptions.projectRoot,
          new RegExp("helpers?\\.(" + gruntOptions.extensions + ")$", 'i'));
      }

      var jasmineOptions = {
        specFolders:        options.specFolders,
        onComplete:         onComplete,
        isVerbose:          grunt.option('verbose')?true:options.isVerbose,
        showColors:         options.showColors,
        teamcity:           options.teamcity,
        useRequireJs:       options.useRequireJs,
        regExpSpec:         regExpSpec,
        junitreport:        options.junitreport,
        includeStackTrace:  options.includeStackTrace,
        coffee:             options.coffee,
        growl:              options.growl
      };

      try {
        // for jasmine-node@1.0.27 individual arguments need to be passed
        // order is preserved in node.js
        legacyArguments = Object.keys(options).map(function(key) {
          return options[key];
        });

        jasmine.executeSpecsInFolder.apply(this, legacyArguments);
      }
      catch (e) {
        try {
          // since jasmine-node@1.0.28 an options object need to be passed
        jasmine.executeSpecsInFolder(jasmineOptions);
        } catch (e) {
          console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
        }
      }

    });
};
