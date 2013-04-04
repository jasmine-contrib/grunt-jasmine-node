module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');
      var util;
      var Path = require('path');
      var _ = grunt.util._;

      try {
          util = require('util');
      } catch(e) {
          util = require('sys');
      }

      var projectRoot     = this.projectRoot || ".";
      var source          = this.source || "src";
      var specNameMatcher = this.specNameMatcher || "spec";
      var teamcity        = this.teamcity || false;
      var useRequireJs    = this.requirejs || false;
      var extensions      = this.extensions || "js";
      var match           = this.match || ".";
      var matchall        = this.matchall || false;
      var autotest        = this.autotest || false;
      var useHelpers      = this.useHelpers || false;
      var forceExit       = this.forceExit || false;

      var isVerbose       = this.verbose;
      var showColors      = this.colors;

      if (_.isUndefined(isVerbose)) {
        isVerbose = true;
      }

      if (_.isUndefined(showColors)) {
        showColors = true;
      }

      var junitreport = {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
      };

      var jUnit = this.jUnit || junitreport;

      // Tell grunt this task is asynchronous.
      var done = this.async();

      var regExpSpec = new RegExp(match + (matchall ? "" : specNameMatcher + "\\.") + "(" + extensions + ")$", 'i');
      var onComplete = function(runner, log) {
        var exitCode;
        util.print('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (forceExit) {
            process.exit(exitCode);
          }
        }

        done();
      };

      var options = {
        specFolder:   projectRoot,
        onComplete:   onComplete,
        isVerbose:    isVerbose,
        showColors:   showColors,
        teamcity:     teamcity,
        useRequireJs: useRequireJs,
        regExpSpec:   regExpSpec,
        junitreport:  jUnit
      };

      // order is preserved in node.js
      var legacyArguments = Object.keys(options).map(function(key) {
        return options[key];
      });

      try {
        // for jasmine-node@1.0.27 individual arguments need to be passed
        jasmine.executeSpecsInFolder.apply(this, legacyArguments);
      }
      catch (e) {
        try {
          // since jasmine-node@1.0.28 an options object need to be passed
          jasmine.executeSpecsInFolder(options);
        } catch (e) {
          console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
        }
      }
    });
};
