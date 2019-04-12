[![Build Status](https://img.shields.io/codeship/ba96f3c0-7103-0134-0ab4-36aa8dc0a6fb/master.svg?style=flat-square)](https://codeship.com/projects/178250)
[![Coverage Status](https://img.shields.io/codecov/c/github/moroshko/analyze-deps/master.svg?style=flat-square)](https://codecov.io/gh/moroshko/analyze-deps)
[![bitHound Overall Score](https://www.bithound.io/github/moroshko/analyze-deps/badges/score.svg)](https://www.bithound.io/github/moroshko/analyze-deps)
[![npm Version](https://img.shields.io/npm/v/analyze-deps.svg?style=flat-square)](https://npmjs.org/package/analyze-deps)

# Analyze Deps

Compare dependencies in package.json to the latest available versions.

## Installation

```shell
npm install analyze-deps --save
```

## Usage

```js
const analyzeDeps = require('analyze-deps');
const packageJson = {
  name: 'analyze-deps',
  license: 'MIT',
  dependencies: {
    'lodash.mapvalues': "^4.6.0",
    'package-json': "^1.2.0",
    'promise-all': "^1.0.0",
    'semver': "^5.2.0"
  },
  devDependencies: {
    'eslint': "^3.7.0"
  }
};

analyzeDeps(packageJson).then(analysis => console.log(analysis));
/*
  {
    dependencies: {
      'lodash.mapvalues': {
        status: 'latest'
      },
      'package-json': {
        status: 'not-latest',
        current: '^1.2.0',
        latest: '2.4.0',
        latestRange: '^2.4.0',
        diff: 'major'
      },
      'promise-all': {
        status: 'latest'
      },
      semver: {
        status: 'not-latest',
        current: '^5.2.0',
        latest: '5.3.0',
        latestRange: '^5.3.0',
        diff: 'minor'
      }
    },
    devDependencies: {
      eslint: {
        status: 'not-latest',
        current: '^3.7.0',
        latest: '3.7.1',
        latestRange: '^3.7.1',
        diff: 'patch'
      }
    }
  }
*/
```

## Description

This library analyzes the provided `package.json`, and returns the packages which version range can be updated to include the latest version only.

Currently, only `dependencies` and `devDependencies` are analyzed (feel free to submit a Pull Request if you need more than that).

You can pass a second argument if you don't want to analyze everything. For example, to avoid analyzing `dependencies`, do:

```js
analyzeDeps(packageJson, { dependencies: false }).then(...)
```

## Related

* [analyze-deps-cli](https://github.com/moroshko/analyze-deps-cli) - CLI for this module

## License

[MIT](http://moroshko.mit-license.org)
