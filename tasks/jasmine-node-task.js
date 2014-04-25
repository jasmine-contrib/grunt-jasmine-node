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

      var options = this.options({
        specFolders: [],
        watchFolders: [],
        projectRoot:'',
        forceExit: false,
        match: '.',
        matchall: false,
        specNameMatcher: 'spec',
        extensions: 'js',
        showColors: true,
        includeStackTrace: true,
        teamcity: false,
        coffee: false,
        verbose: false,
        jUnit: {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
        },
        growl: false
      });
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

      var match = options.match + (options.matchall ? "" : options.specNameMatcher + "\\.") + "(" + options.extensions + ")$";

      var onComplete = function(runner, log) {
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

      var jasmineOptions = {
        specFolders: options.specFolders,
        watchFolders: options.watchFolders,
        onComplete:   onComplete,
        verbose: grunt.verbose ? true : options.verbose,
        showColors: options.showColors,
        teamcity: options.teamcity,
        match: match,
        junitreport: options.jUnit,
        includeStackTrace: options.includeStackTrace,
        coffee: options.coffee,
        growl: options.growl
      };

      try {
          jasmine.run(jasmineOptions);
        } catch (e) {
          console.log('Failed to execute "jasmine.run": ' + e.stack);
        }

    });
};
