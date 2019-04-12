'use strict'
/* global describe it */
var JSON = require('../lighter-json')
var is = global.is || require('exam/lib/is')
var c = JSON.colorize

describe('JSON.colorize', function () {
  it('works for undefined', function () {
    var s = c(undefined)
    is(s, c.gray + 'undefined' + c.base)
  })

  it('works for null', function () {
    var s = c(null)
    is(s, c.gray + 'null' + c.base)
  })

  it('works for booleans', function () {
    var s = c(true)
    is(s, c.yellow + 'true' + c.base)
  })

  it('works for numbers', function () {
    var s = c(1)
    is(s, c.magenta + '1' + c.base)
  })

  it('works for strings', function () {
    var s = c('hi')
    is(s, c.green + '"hi"' + c.base)
  })

  it('works for functions', function () {
    var s = c(function () {})
    is(s, c.cyan + 'function () {}' + c.base)
  })

  it('works for long functions', function () {
    var s = c(c)
    is(s, c.cyan + 'function colorize (value, options) {...}' + c.base)
  })

  it('works for anonymous long functions', function () {
    var s = c(this.parent.fn)
    is(s, c.cyan + 'function () {...}' + c.base)
  })

  it('works for dates', function () {
    var s = c(new Date(0))
    is(s, c.cyan + '[Date: Thu, 01 Jan 1970 00:00:00 GMT]' + c.base)
  })

  it('works for errors', function () {
    var e = new Error()
    e.stack = 'TestError'
    var s = c(e)
    is(s, c.red + 'TestError' + c.base)
    JSON.colorize.color(false)
    var o = {e: new Error()}
    o.e.stack = 'TestError'
    s = c(o)
    is(s, '{e: [Error]}')
    o = {e: new Error('TestError')}
    s = c(o)
    is.in(s, 'TestError')
    JSON.colorize.color(true)
  })

  it('works for stackless errors', function () {
    var e = new Error()
    e.stack = ''
    var s = c(e)
    is(s, c.red + 'Error' + c.base)
  })

  it('works for regular expressions', function () {
    var s = c(/a/gim)
    is(s, c.green + '/a/gim' + c.base)
    s = c(/a/)
    is(s, c.green + '/a/' + c.base)
  })

  it('works without spaces', function () {
    c.space = ''
    var o = {}
    o.ok = true
    var s = c(o)
    is(s, c.gray + '{' + c.base + 'ok' + c.gray + ':' + c.yellow + 'true' + c.base + c.gray + '}' + c.base)
    c.space = '  '
  })

  it('works for nested objects', function () {
    var o = {x: {ok: true}}
    var s = c(o)
    is(s, c.gray + '{' + c.base + 'x' + c.gray + ': ' + c.gray + '{' + c.base + 'ok' + c.gray + ': ' + c.yellow + 'true' + c.base + c.gray + '}' + c.base + c.gray + '}' + c.base)
  })

  it('works for empty objects', function () {
    var o = {}
    var s = c(o)
    is(s, c.gray + '{' + c.base + c.gray + '}' + c.base)
  })

  it('works for circular references', function () {
    var o = {}
    o.o = o
    var s = c(o)
    is(s, c.gray + '{' + c.base + 'o' + c.gray + ': ' + c.gray + '[Circular 1]' + c.base + c.gray + '}' + c.base)
  })

  it('makes underscored properties gray', function () {
    var o = {_private: true}
    var s = c(o)
    is(s, c.gray + '{' + c.base + c.gray + '_private' + c.gray + ': ' + c.yellow + 'true' + c.base + c.gray + '}' + c.base)
  })

  it('quotes special keys', function () {
    var o = {'\t': 'tab'}
    var s = c(o)
    is(s, c.gray + '{' + c.base + "'\\t'" + c.gray + ': ' + c.green + '"tab"' + c.base + c.gray + '}' + c.base)
  })

  it('works for deep objects', function () {
    c.color(false)
    var o = {o: {o: {o: {o: {o: {}}}}}}
    var s = c(o)
    is(s, '{o: {o: {o: {o: {o: [Object]}}}}}')
    var a = [[[[[[]]]]]]
    s = c(a)
    is(s, '[[[[[[Array]]]]]]')
    c.color(true)
  })

  it('skips prototype properties if ownOnly is true', function () {
    c.color(false)
    c.ownOnly = true
    var Thing = function () {}
    Thing.prototype.hi = 'Hi!'
    var thing = new Thing()
    thing.ok = true
    var s = c(thing)
    is(s, '{ok: true}')
    c.color(false)
  })
})
