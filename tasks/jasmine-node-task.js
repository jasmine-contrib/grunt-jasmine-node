var path = require('path');


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

      if(options.globals) {
        Object.keys(options.globals).forEach(function(key) {
          global[key] = options.globals[key];
        });

        delete options.globals;
      }

      function processPaths(fileName, specFolder, specFolders) {
         if(specFolder[0] === '/') {
          specFolder = specFolder.subst(1);
         }

         specFolder = path.join(process.cwd(), '/', specFolder);
         
         if(specFolders.indexOf(specFolder) === -1) {
           specFolders.push(specFolder);
         }

         if(/\.coffee/.test(fileName) && !options.coffee) {
           options.coffee = true;
         } 
      }
      
      var filePaths;

      if(this.filesSrc.length > 0){
        filePaths = this.filesSrc;
      } else {
        filePaths = this.files[0].orig.src;
      }
      
      filePaths.forEach(function(file){
        var lastSlashIndex = file.lastIndexOf('/');
        
        var fileName = file.substr(lastSlashIndex + 1);
        var specFolder = file.replace(fileName, '');
        
        processPaths(fileName, specFolder, options.specFolders);
      });

      if (options.projectRoot) {
        options.specFolders.push(options.projectRoot);
      }

      if (options.asyncTimeout) {
        jasmine.getEnv().defaultTimeoutInterval = options.asyncTimeout;
        delete options.asyncTimeout;
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
        done(exitCode === 0);
      };

      if (options.useHelpers) {
        this.filesSrc.forEach(function(path){
          jasmine.loadHelpersInFolder(path, new RegExp(options.helperNameMatcher + "?\\.(" + options.extensions + ")$", 'i'));
        });
      }

      if(options.consoleReporter) {
        var consoleReporter = new jasmine.ConsoleReporter({
          showColors: true,
          print: function() {
            console.log.apply(console, arguments);
          }
        });

        jasmine.getEnv().addReporter(consoleReporter);

        delete options.consoleReporter;
      }

      var jasmineOptions = {
        specFolders: options.specFolders,
        onComplete:   onComplete,
        isVerbose: options.verbose ? options.verbose : false,
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
        // since jasmine-node@1.0.28 an options object need to be passed
        jasmine.executeSpecsInFolder(jasmineOptions);
      } catch (e) {
        console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
      }

    });
};
