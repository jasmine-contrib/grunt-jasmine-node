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

      var projectRoot     = grunt.config("jasmine_node.projectRoot") || ".";
      var source          = grunt.config("jasmine_node.source") || "src";
      var specNameMatcher = grunt.config("jasmine_node.specNameMatcher") || "spec";
      var teamcity        = grunt.config("jasmine_node.teamcity") || false;
      var useRequireJs    = grunt.config("jasmine_node.requirejs") || false;
      var extensions      = grunt.config("jasmine_node.extensions") || "js";
      var match           = grunt.config("jasmine_node.match") || ".";
      var matchall        = grunt.config("jasmine_node.matchall") || false;
      var autotest        = grunt.config("jasmine_node.autotest") || false;
      var useHelpers      = grunt.config("jasmine_node.useHelpers") || false;
      var forceExit       = grunt.config("jasmine_node.forceExit") || false;

      var isVerbose       = grunt.config("jasmine_node.verbose");
      var showColors      = grunt.config("jasmine_node.colors");

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

      var jUnit = grunt.config("jasmine_node.jUnit") || junitreport;

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

      try {
        jasmine.executeSpecsInFolder(projectRoot,
          onComplete,
          isVerbose,
          showColors,
          teamcity,
          useRequireJs,
          regExpSpec,
          jUnit);
      }
      catch (e) {
        console.log(e);
      }
    });
};
