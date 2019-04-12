'use strict'
var self = exports

// Reference the native JSON.stringify function in case we change it.
var nativeStringify = JSON.stringify

// Special character replacements.
var special = {
  '\\': '\\\\',
  "'": "\\'",
  '\r': '\\r',
  '\t': '\\t',
  '\n': '\\n'
}

/**
 * Stringify a value while safely detecting circularity.
 *
 * @param  {Any}           value     A value to stringify.
 * @param  {Function}      replacer  An optional replacer function.
 * @param  {Number|String} space     Optional whitespace or number of spaces.
 * @return {String}                  Stringified JSON.
 */
self.stringify = function stringify (value, replacer, space) {
  return replacer
    ? nativeStringify(value, replacer, space)
    : safeStringify(value, [], space)
}

/**
 * Stringify using a stack of parent values to detect circularity.
 *
 * @param  {Any}           value   A value to stringify.
 * @param  {Array}         stack   An optional stack of parent values.
 * @param  {Number|String} space   Optional whitespace or number of spaces.
 * @return {String}                Stringified JSON.
 */
var safeStringify = function safeStringify (value, stack, space) {
  if (typeof value !== 'object' ||
    value === null ||
    value instanceof String ||
    value instanceof Number ||
    value instanceof Boolean) {
    return nativeStringify(value)
  }
  var length = stack.length
  for (var i = 0; i < length; i++) {
    if (stack[i] === value) {
      return '"[Circular ' + (length - i) + ']"'
    }
  }
  stack.push(value)
  var isArray = (value instanceof Array)
  var list = []
  var json
  if (isArray) {
    length = value.length
    for (i = 0; i < length; i++) {
      json = safeStringify(value[i], stack, space)
      list.push(json === undefined ? 'null' : json)
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        json = safeStringify(value[key], stack, space)
        if (json !== undefined) {
          key = nativeStringify(key) + ':' + (space ? ' ' : '')
          list.push(key + json)
        }
      }
    }
  }
  if (space && list.length) {
    var indent = '\n' + (new Array(stack.length)).join(space)
    var indentSpace = indent + space
    list = indentSpace + list.join(',' + indentSpace) + indent
  } else {
    list = list.join(',')
  }
  value = isArray ? '[' + list + ']' : '{' + list + '}'
  stack.pop()
  return value
}

/**
 * Convert an object to non-strict JSON, complete with JS code for
 * re-constructing Date, Error, Function and RegExp values.
 *
 * The JSON.scriptify method also has options, attached as properties:
 * - scriptify.ownPropertiesOnly: false
 * - scriptify.maxDepth: 5
 *
 * @param  {Any}    value    A value to stringify.
 * @param  {Object} options  Optional options:
 *                             * ownOnly: Whether to only show an object's
 *                                 own properties, thereby omitting properties
 *                                 that were inherited from its prototype.
 *                             * maxDepth: Maximum property depth. (default: 5)
 * @return {String}          Stringified JavaScript.
 */
var scriptify = self.scriptify = function (value, options) {
  var type = (typeof value)
  if (type === 'function') {
    return value.toString()
  }
  if (type === 'string' || value instanceof String) {
    return nativeStringify(value)
  }
  if (value instanceof Boolean || value instanceof Number) {
    return '' + value
  }
  if (type === 'object' && value) {
    if (value instanceof Date) {
      return 'new Date(' + value.getTime() + ')'
    }
    if (value instanceof Error) {
      return '(function(){var e=new Error(' + scriptify(value.message) + ');' +
        'e.stack=' + scriptify(value.stack) + ';return e})()'
    }
    if (value instanceof RegExp) {
      return '/' + value.source + '/' + (value.global ? 'g' : '') + (value.ignoreCase ? 'i' : '') + (value.multiline ? 'm' : '')
    }
    options = options || {}
    var maxDepth = options.maxDepth || scriptify.maxDepth
    var ownOnly = options.ownOnly || scriptify.ownOnly
    var stack = options._stack
    var i, length
    if (stack) {
      for (i = 0, length = stack.length; i < length; i++) {
        if (stack[i] === value) {
          return '{"^":' + (length - i) + '}'
        }
      }
      stack[length] = value
    } else {
      stack = options._stack = [value]
      length = 1
    }
    var string
    var isArray = (value instanceof Array)
    if (length >= maxDepth) {
      value = isArray ? '"[Array]"' : '"[Object]"'
    } else if (isArray) {
      string = '['
      for (i = 0, length = value.length; i < length; i++) {
        string += (i ? ',' : '') + scriptify(value[i], options)
      }
      stack.pop()
      return string + ']'
    } else {
      i = 0
      string = '{'
      for (var key in value) {
        if (!ownOnly || value.hasOwnProperty(key)) {
          if (/[^$\w]/.test(key)) {
            key = '"' + key.replace(/[\\'\r\n\t]/g, function (char) {
              return special[char]
            }) + '"'
          }
          string += (i ? ',' : '') + key + ':' + scriptify(value[key], options)
          i++
        }
      }
      stack.pop()
      return string + '}'
    }
  }
  return '' + value
}
scriptify.maxDepth = 5
scriptify.ownOnly = false

/**
 * Evaluate a piece of JavaScript code.
 *
 * @param  {String} js  A snippet of JavaScript code.
 * @return {Any}        The value of that snippet.
 */
var run = require('vm').runInThisContext
var evaluate = self.evaluate = (function () {
  /* eslint-disable */
  // Scope some variables locally.
  var require, module, self, __filename, __dirname
  var global, process, console, JSON
  var colorize, nativeStringify, scriptify, safeStringify
  /* eslint-enable */
  return function evaluate (js) {
    return run('(' + js + ')')
  }
})()

/**
 * Listen to a readable stream that's not in object mode, and interpret its
 * lines as objects.
 *
 * @param  {Object} stream  A readable stream.
 * @return {Object}         The stream.
 */
self.reader = function reader (stream) {
  stream._jsonData = ''
  stream.on('data', onData)
  return stream
}

/**
 * Stop listening for objects on a readable stream that's not in object mode.
 *
 * @param  {Object} stream  A readable stream.
 * @return {Object}         The stream.
 */
self.unreader = function unreader (stream) {
  stream.removeListener('data', onData)
  delete stream._jsonData
  return stream
}

/**
 * Handle data on a readable stream as full or partial JSON.
 *
 * @param  {Object} chunk  A chunk of data.
 */
function onData (chunk) {
  var data = this._jsonData + chunk
  var end = data.indexOf('\n')
  while (end > 0) {
    var line = data.substr(0, end)
    data = data.substr(end + 1)
    try {
      line = evaluate(line)
      this.emit(typeof line, line)
    } catch (e) {
      this.emit('error', e)
    }
    end = data.indexOf('\n')
  }
  this._jsonData = data
}

/**
 * Write a value to a stream as a non-strict JSON line.
 *
 * @param  {Object}   stream  A readable stream.
 * @param  {Function} fn      An optional errback confirming the write.
 * @return {Object}           The stream.
 */
self.writer = function writer (stream, fn) {
  var write = stream._writer = stream.write
  stream.write = function (object) {
    var js = scriptify(object)
    return write.call(stream, js + '\n', 'utf-8', fn)
  }
  return stream
}

/**
 * Write a value to a stream as a non-strict JSON line.
 *
 * @param  {Object}   stream  A readable stream.
 * @return {Object}           The stream.
 */
self.unwriter = function unwriter (stream) {
  stream.write = stream._writer
  return stream
}

/**
 * Create colorized JSON for terminals.
 *
 * @param  {Any}    value    A value to stringify.
 * @param  {Object} options  Optional options:
 *                             * ownOnly: Whether to only show an object's
 *                                 own properties, thereby omitting properties
 *                                 that were inherited from its prototype.
 *                             * maxWidth: Maximum output width. (default: 80)
 *                             * maxDepth: Maximum property depth. (default: 5)
 *                             * space: String of whitespace, or number of
 *                                 spaces. (default: '  ')
 */
var colorize = self.colorize = function colorize (value, options) {
  options = options || {}
  var ownOnly = options.ownOnly || colorize.ownOnly
  var space = options.space || colorize.space
  var indent = options._indent || ''
  var maxWidth = options.maxWidth || colorize.maxWidth
  var maxDepth = options.maxDepth || colorize.maxDepth
  var stack = options._stack
  var type = typeof value
  var color = colorize[colorize[type]]
  if (type === 'function') {
    value = value.toString().replace(/\s+/g, ' ')
    if (value.length > maxWidth) {
      value = value
        .replace(/^([^{]+?)\{.*\}$/, '$1 {...}')
        .replace(/(\w)\(/, '$1 (')
        .replace(/([,)])/g, '$1 ')
        .replace(/\s+/g, ' ')
    }
  } else if (type === 'string' ||
    value instanceof String ||
    value instanceof Number ||
    value instanceof Boolean) {
    value = nativeStringify(value)
  } else if ((type === 'object') && value) {
    if (value instanceof Date) {
      value = '[Date: ' + value.toUTCString() + ']'
      color = colorize.cyan
    } else if (value instanceof Error) {
      var e = value
      var message = (e.stack || e.message || e.toString())
      if (stack) {
        message = message.replace(/^\w*Error:? ?/, '')
        value = '[Error' + (message ? ': ' + message : '') + ']'
      } else {
        value = message
      }
      color = colorize.red
    } else if (value instanceof RegExp) {
      value = '/' + value.source + '/' +
        (value.global ? 'g' : '') +
        (value.ignoreCase ? 'i' : '') +
        (value.multiline ? 'm' : '')
      color = colorize.green
    } else {
      stack = options._stack = options._stack || []
      var colon = colorize.gray + (space ? ': ' : ':')
      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === value) {
          return colorize.gray + '[Circular ' + (l - i) + ']' + colorize.base
        }
      }
      stack.push(value)
      var parts = []
      var length = 0
      var text
      var isArray = (value instanceof Array)
      if (stack.length > maxDepth) {
        value = colorize.cyan + (isArray ? '[Array]' : '[Object]') + colorize.base
      } else {
        options._indent = indent + space
        options.maxWidth -= space.length
        if (isArray) {
          value.forEach(function (prop) {
            text = JSON.colorize(prop, options)
            length += text.replace().length
            parts.push(text)
          })
        } else {
          for (var key in value) {
            if (!ownOnly || value.hasOwnProperty(key)) {
              var prop = value[key]
              if (/[^$\w]/.test(key)) {
                key = "'" + key.replace(/[\\'\r\n\t]/g, function (char) {
                  return special[char]
                }) + "'"
              }
              if (key[0] === '_') {
                key = colorize.gray + key
              }
              text = key + colon + colorize(prop, options)
              length += text.plain.length
              parts.push(text)
            }
          }
        }
        options._indent = indent
        options.maxWidth = maxWidth
        if (space) {
          if (parts.length) {
            length += (parts.length - 1) * 2
          }
          if (length + indent.length > maxWidth) {
            value = '\n' + indent + parts.join(colorize.gray + ',\n' + colorize.base + indent) + '\n' + indent.substr(2)
          } else {
            value = parts.join(colorize.gray + ', ' + colorize.base)
          }
        } else {
          value = parts.join(colorize.gray + ',' + colorize.base)
        }
        if (isArray) {
          value = '[' + colorize.base + value + colorize.gray + ']'
        } else {
          value = '{' + colorize.base + value + colorize.gray + '}'
        }
      }
      stack.pop()
    }
  }
  return color + value + colorize.base
}
colorize.maxWidth = 80
colorize.maxDepth = 5
colorize.maxSize = 1e3
colorize.space = '  '
colorize.function = 'cyan'
colorize.undefined = 'gray'
colorize.boolean = 'yellow'
colorize.number = 'magenta'
colorize.string = 'green'
colorize.object = 'gray'

colorize.color = function color (enable) {
  colorize.base = enable ? '\u001b[39m' : ''
  colorize.red = enable ? '\u001b[31m' : ''
  colorize.green = enable ? '\u001b[32m' : ''
  colorize.yellow = enable ? '\u001b[33m' : ''
  colorize.magenta = enable ? '\u001b[35m' : ''
  colorize.cyan = enable ? '\u001b[36m' : ''
  colorize.gray = enable ? '\u001b[90m' : ''
}

// Enable colors.
colorize.color(true)

// Copy methods to the global JSON object.
JSON.safeStringify = self.stringify
JSON.scriptify = self.scriptify
JSON.colorize = self.colorize
JSON.evaluate = self.evaluate
JSON.reader = self.reader
JSON.unreader = self.unreader
JSON.writer = self.writer
JSON.unwriter = self.unwriter
self.parse = JSON.parse
