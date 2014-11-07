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
          showColors: true,
          includeStackTrace: false,
          projectRoot:'', 
          forceExit: false,
          matchall: false,
          coffee: false,
          growl: false,
          asyncTimeout: 30000,
          verbose: false,
          consoleReporter: true,
          globals: {
            linkPath: '<%= grunt.config.get("link_path") %>'
          }
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
