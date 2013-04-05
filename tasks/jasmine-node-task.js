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
        jUnit: {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
        }
      });

      // Tell grunt this task is asynchronous.
      var done = this.async();

      var regExpSpec = new RegExp(options.match + (options.matchall ? "" : options.specNameMatcher + "\\.") + "(" + options.extensions + ")$", 'i');

      var onComplete = function(runner, log) {
        var exitCode;
        util.print('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (options.forceExit) {
            process.exit(exitCode);
          }
        }
        jasmine.getGlobal().jasmine.currentEnv_ = undefined;
        done();
      };

      if (options.useHelpers) {
        this.filesSrc.forEach(function(path){
          jasmine.loadHelpersInFolder(path, new RegExp(options.helperNameMatcher + "?\\.(" + options.extensions + ")$", 'i'));
        });
      }

      var jasmineOptions = {
        specFolders: this.filesSrc,
        onComplete: onComplete,
        isVerbose: grunt.verbose,
        showColors: options.showColors,
        teamcity: options.teamcity,
        useRequireJs: options.useRequireJs,
        regExpSpec: regExpSpec,
        junitreport: this.options.jUnit,
        includeStackTrace: options.includeStackTrace,
        coffee: options.coffee
      };

      try {
        // since jasmine-node@1.0.28 an options object need to be passed
        jasmine.executeSpecsInFolder(jasmineOptions);
      } catch (e) {
        console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
      }

    });
};
