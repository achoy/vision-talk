# lighter-json
[![Chat](https://badges.gitter.im/chat.svg)](//gitter.im/lighterio/public)
[![Version](https://img.shields.io/npm/v/lighter-json.svg)](//www.npmjs.com/package/lighter-json)
[![Downloads](https://img.shields.io/npm/dm/lighter-json.svg)](//www.npmjs.com/package/lighter-json)
[![Build](https://img.shields.io/travis/lighterio/lighter-json.svg)](//travis-ci.org/lighterio/lighter-json)
[![Coverage](https://img.shields.io/codecov/c/github/lighterio/lighter-json/master.svg)](//codecov.io/gh/lighterio/lighter-json)
[![Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](//www.npmjs.com/package/standard)

The `lighter-json` module is a lightweight JavaScript Object Notation utility.

## Quick Start
From your project directory, install and save as a dependency:
```bash
npm install --save lighter-json
```

Then use `lighter-json` in place of the global `JSON` object for circular
reference safety and more.

```
var JSON = require('lighter-json')

// Create a circular reference, if you like.
var object = {}
object.reference = object

// It's OK, you're safe.
var json = JSON.stringify(object)
console.log(json)

//> {"reference":"[Circular 1]"}
```

## API
The `lighter-json` package exports an object with several methods for dealing
with JSON and non-strict JSON. It also populates same-name methods onto the
global JSON object, apart from its `stringify` method, which is populated as
`JSON.safeStringify`.

### lighterJson.stringify(value[, replacer[, space]])
Perform a JSON stringify operation on a value, using automatic cycle detection
if a replacer function is not provided.

### lighterJson.parse(json)
Parse a JSON string (using the builtin `JSON.parse`).

### lighterJson.scriptify(value)
Represent a value as non-strict JSON, complete with JS code for
re-constructing Date, Error, Function and RegExp values.

### lighterJson.evaluate(js)
Evaluate and return a value from a JavaScript string representation. This
supports non-strict JSON, so a value (or a deep property) can be a Date, a
Function, an Error or a RegExp.

### lighterJson.reader(readableStream)
Listen to a readable stream that's not in object mode, and interpret its
lines as JavaScript values (using `lighterJson.evaluate`).

### lighterJson.unreader(readableStream)
Stop listening for values on a readable stream.

### lighterJson.writer(writableStream)
Replace the stream's write method with one that accepts objects and writes non-strict JSON.

### lighterJson.unwriter(writableStream)
Puts a writable stream's write method back.

### lighterJson.colorize(value)
Evaluate and return a value from a JavaScript string representation. This
supports non-strict JSON, so a value (or a deep property) can be a Date, a
Function, an Error or a RegExp.

## More on lighter-json...
* [Contributing](//github.com/lighterio/lighter-json/blob/master/CONTRIBUTING.md)
* [License (ISC)](//github.com/lighterio/lighter-json/blob/master/LICENSE.md)
* [Change Log](//github.com/lighterio/lighter-json/blob/master/CHANGELOG.md)
* [Roadmap](//github.com/lighterio/lighter-json/blob/master/ROADMAP.md)
