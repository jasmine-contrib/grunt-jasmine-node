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

      var projectRoot       = grunt.config("jasmine_node.projectRoot") || ".";
      var specFolders       = grunt.config("jasmine_node.specFolders") || [];
      var source            = grunt.config("jasmine_node.source") || "src";
      var specNameMatcher   = grunt.config("jasmine_node.specNameMatcher") || "spec";
      var teamcity          = grunt.config("jasmine_node.teamcity") || false;
      var useRequireJs      = grunt.config("jasmine_node.requirejs") || false;
      var extensions        = grunt.config("jasmine_node.extensions") || "js";
      var match             = grunt.config("jasmine_node.match") || ".";
      var matchall          = grunt.config("jasmine_node.matchall") || false;
      var autotest          = grunt.config("jasmine_node.autotest") || false;
      var useHelpers        = grunt.config("jasmine_node.useHelpers") || false;
      var forceExit         = grunt.config("jasmine_node.forceExit") || false;
      var useCoffee         = grunt.config("jasmine_node.useCoffee") || false;
      var captureExceptions = grunt.config("jasmine_node.captureExceptions") || false;
      var growl             = grunt.config("jasmine_node.growl") || false;
      var junitreport       = grunt.config("jasmine_node.junitreport");

      var isVerbose         = grunt.config("jasmine_node.verbose") || true;
      var showColors        = grunt.config("jasmine_node.colors") || true;

      if (projectRoot) {
        specFolders.push(projectRoot);
      }

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
        match:           match,
        matchall:        matchall,
        specNameMatcher: specNameMatcher,
        extensions:      extensions,
        specFolders:     specFolders,
        onComplete:      onComplete,
        isVerbose:       isVerbose,
        showColors:      showColors,
        teamcity:        teamcity,
        useRequireJs:    useRequireJs,
        coffee:          useCoffee,
        junitreport:     junitreport,
        growl:           growl
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




      if (captureExceptions) {
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

      if (useHelpers) {
        jasmine.loadHelpersInFolder(projectRoot,
        new RegExp("helpers?\\.(" + extensions + ")$", 'i'));
      }

      var jasmineOptions = {
        specFolders:        options.specFolders,
        onComplete:         onComplete,
        isVerbose:          grunt.option('verbose')?true:options.verbose,
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
