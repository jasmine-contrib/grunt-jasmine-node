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
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec',
          coffee: true,
          jUnit: {
            report: true,
            savePath : "./build/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
          },
          growl: true
        },
        all: ['spec/'] // will be merged with the specFolders option and the projectRoot
      }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['jshint' ,'jasmine_node']);

};
