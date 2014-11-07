# grunt-jasmine-node

A fork of the grunt.js task to run your jasmine feature suite using jasmine-node.

## Getting Started
Install this grunt plugin next to your project's grunt.js gruntfile with: `npm install grunt-jasmine-node`

Then add this line to your project's `Gruntfile.js` grunt file:

```javascript
grunt.initConfig({
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
    }
  }
});

grunt.loadNpmTasks('grunt-jasmine-node');

grunt.registerTask('default', ['jasmine_node']);
```

## Options

default options are:

```javascript
{
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
}
```

## Differences

The current version of `grunt-jamsine-node` seems to be unmaintained and unreliable for certain options.  Also, I have specific project requirements that require easy specification of Node globals from the Gruntfile and also easily setting async test timeouts and logging testing info to the console.


