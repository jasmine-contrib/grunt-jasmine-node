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
        projectRoot:'',
        match: '.',
        matchall: false,
        specNameMatcher: 'spec',
        helperNameMatcher: 'helpers',
        extensions: 'js',
        showColors: true,
        includeStackTrace: true,
        useHelpers: false,
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
      var regExpSpec = new RegExp(options.match + (options.matchall ? "" : options.specNameMatcher + "\\.") + "(" + options.extensions + ")$", 'i');

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

      if (options.useHelpers) {
        this.filesSrc.forEach(function(path){
          jasmine.loadHelpersInFolder(path, new RegExp(options.helperNameMatcher + "?\\.(" + options.extensions + ")$", 'i'));
        });
      }

      var jasmineOptions = {
        specFolders: options.specFolders,
        onComplete:   onComplete,
        isVerbose: grunt.option('verbose') ? true:options.verbose,
        showColors: options.showColors,
        teamcity: options.teamcity,
        useRequireJs: options.useRequireJs,
        regExpSpec:   regExpSpec,
        junitreport: options.jUnit,
        includeStackTrace: options.includeStackTrace,
        coffee: options.coffee,
        growl: options.growl
      };

      try {
          jasmine.executeSpecsInFolder(jasmineOptions);
      } catch (e) {
          console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
      }

    });
};
