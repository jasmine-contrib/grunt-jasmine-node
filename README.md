# grunt-jasmine-node

A grunt.js task to run your jasmine feature suite using jasmine-node.

## Getting Started
Install this grunt plugin next to your project's grunt.js gruntfile with: `npm install grunt-jasmine-node`

Then add this line to your project's `grunt.js` grunt file:

```javascript
grunt.initConfig({
  jasmine_node: {
    all: {
      specNameMatcher: "./spec", // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  }
});

grunt.loadNpmTasks('grunt-jasmine-node');

grunt.registerTask('default', 'jasmine_node');
```

## Sharing Configs

If you have multiple targets, it may be helpful to share common configuration settings between them. This is supported by using the `options` property:

```javascript
grunt.initConfig({
  jasmine_node: {
    options: {
      forceExit: false,
      specNameMatcher: './spec',
    },
    dev: {
      jUnit: {
        report: false
      }
    },
    continuous: {
      forceExit: true,
      jUnit: {
        report: true,
        savePath : "./build/reports/jasmine/",
      }
    }
  }
});

```
In this example the `continuous` and `dev` targets will both use the `specNameMatcher` specified in the `options`. The `continuous` target will override the `forceExit` setting to `true`, whereas the `dev` target will inherit the `false` setting from `options`.

## Running tests

If you have a single target, run: 

`$ grunt jasmine_node`

If you have multiple targets, you can run the desired target by running with the appropriate `:flag`. For example, with two targets, dev and continuous, running the dev target is as simple as:

`$ grunt jasmine_node:dev`

Additionally, running `$ grunt jasmine_node` when multiple targets are configured will run each target in turn.

## Bugs

Help us squash them by submitting an issue that describes how you encountered it; please be as specific as possible including operating system, node, grunt, and grunt-jasmine-node versions.

## Release History

see [GitHub Repository](/s9tpepper/grunt-jasmine-node).

## License
Copyright (c) 2012 "s9tpepper" Omar Gonzalez & contributors.
Licensed under the MIT license.
