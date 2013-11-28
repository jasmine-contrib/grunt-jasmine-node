module.exports = function (grunt) {
    'use strict';

    grunt.registerTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');
      var util;
      // TODO: ditch this when grunt v0.4 is released
      grunt.util = grunt.util || grunt.utils;
      var Path = require('path');
      var _ = grunt.util._;

      try {
          util = require('util');
      } catch(e) {
          util = require('sys');
      }

      var projectRoot     = grunt.config(this.name + ".projectRoot") || ".";
      var specFolders     = grunt.config(this.name + ".specFolders") || [];
      var source          = grunt.config(this.name + ".source") || "src";
      var specNameMatcher = grunt.config(this.name + ".specNameMatcher") || "spec";
      var teamcity        = grunt.config(this.name + ".teamcity") || false;
      var useRequireJs    = grunt.config(this.name + ".requirejs") || false;
      var extensions      = grunt.config(this.name + ".extensions") || "js";
      var match           = grunt.config(this.name + ".match") || ".";
      var matchall        = grunt.config(this.name + ".matchall") || false;
      var autotest        = grunt.config(this.name + ".autotest") || false;
      var useHelpers      = grunt.config(this.name + ".useHelpers") || false;
      var forceExit       = grunt.config(this.name + ".forceExit") || false;
      var useCoffee       = grunt.config(this.name + ".useCoffee") || false;

      var isVerbose       = grunt.config(this.name + ".verbose");
      var showColors      = grunt.config(this.name + ".colors");

      if (projectRoot) {
        specFolders.push(projectRoot);
      }

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

      var jUnit = grunt.config(this.name + ".jUnit") || junitreport;

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
        regExpSpec:      regExpSpec,
        junitreport:     jUnit
      };


      // order is preserved in node.js
      var legacyArguments = Object.keys(options).map(function(key) {
        return options[key];
      });

      if (useHelpers) {
        jasmine.loadHelpersInFolder(projectRoot,
        new RegExp("helpers?\\.(" + extensions + ")$", 'i'));
      }

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
