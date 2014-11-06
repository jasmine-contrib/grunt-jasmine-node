module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
      jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true,
          node: true,
          es5: true
        },
        all: ['tasks/**/*.js']
      },
      jasmine_node: {
        options: {
          specFolders:[],
          projectRoot:'', 
          forceExit: true,
          match: '.',
          includeStackTrace: false,
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec',
          asyncTimeout: 30000,
          coffee: true,
          verbose: false,
          consoleReporter: true,
          jUnit: {
            report: true,
            savePath : "./build/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
          },
          growl: true
        },
        all: {
          src: ['spec/**/*', 'test/**/*']
        },
        src: {
          src: ['spec/', 'test/']
        },
        filesArray: {
          files: [
             {
               cwd: 'spec/',
               expand: true,
               src: ['**/*']
             }
          ]
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['jshint' ,'jasmine_node']);

};
