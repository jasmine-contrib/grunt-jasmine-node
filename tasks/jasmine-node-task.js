module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');
      var util;
      // TODO: ditch this when grunt v0.4 is released
      grunt.util = grunt.util || grunt.utils;
      var _ = grunt.util._;

      try {
          util = require('util');
      } catch(e) {
          util = require('sys');
      }

      var options = this.options({
        projectRoot: ".",
        specFolders: [],
        specNameMatcher: "spec",
        teamcity: false,
        useRequireJs: false,
        extensions: "js",
        match: ".",
        matchall: false,
        useHelpers: false,
        forceExit: false,
        useCoffee: false,
        isVerbose: true,
        showColors: true
      });

      var data = this.data;
      //merge options onto data, with data taking precedence
      data = _.merge(options, data);

      if (data.projectRoot) {
        data.specFolders.push(data.projectRoot);
      }

      var junitreport = {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
      };

      options.junitreport = options.jUnit || junitreport;

      // Tell grunt this task is asynchronous.
      var done = this.async();

      options.regExpSpec = new RegExp(data.match + (data.matchall ? "" : data.specNameMatcher + "\\.") + "(" + data.extensions + ")$", 'i');
      options.onComplete = function(runner) {
        var exitCode;
        util.print('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (data.forceExit) {
            process.exit(exitCode);
          }
        }

        //clear down any global state from test execution
        global.jasmine.currentEnv_ = new jasmine.Env();
        done();
      };

      // order is preserved in node.js
      var legacyArguments = Object.keys(options).map(function(key) {
        return options[key];
      });

      if (data.useHelpers) {
        jasmine.loadHelpersInFolder(data.projectRoot,
        new RegExp("helpers?\\.(" + data.extensions + ")$", 'i'));
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
