'use strict'
/* global describe it */
var JSON = require('../lighter-json')
var is = global.is || require('exam/lib/is')

describe('JSON.safeStringify', function () {
  it('uses a replacer function if given', function () {
    var o = {a: 1, b: 2}
    var n = 0
    var a = JSON.stringify(o, function () { n++ })
    var b = global.JSON.stringify(o, function () {})
    is(a, b)
    is(n, 1)
  })

  describe('matches JSON.stringify', function () {
    it('for undefined', function () {
      match(undefined)
    })

    it('for null', function () {
      match(null)
    })

    it('for booleans', function () {
      match(true)
      match(false)
      match(new Boolean()) // eslint-disable-line
    })

    it('for numbers', function () {
      match(1)
      match(0)
      match(1.1)
      match(-1)
      match(1e6)
      match(1e99)
      match(Infinity)
      match(NaN)
      match(new Number()) // eslint-disable-line
    })

    it('for strings', function () {
      match('hi')
      match('"hi"')
      match('\t"hi"\n')
      match('hi\r\n')
      match('hi\\you')
      match('"hi\\you\\"')
      match('\0\b\n\f\r\t')
      match(new String()) // eslint-disable-line
    })

    it('for functions', function () {
      match(function () {})
      match(match)
      match(JSON.nativeStringify)
    })

    it('for objects', function () {
      match({'0': 1, a: 2, '*': 3})
      match({a: 1, f: function () {}, b: 2})
      match({u: undefined})
    })

    it('for arrays', function () {
      match([1, 2, 3])
    })

    it('for arrays with undefined values', function () {
      match([undefined])
    })

    it('for objects with prototypes', function () {
      var Thing = function () {}
      Thing.prototype.hi = 'Hi!'
      var thing = new Thing()
      thing.ok = true
      match(thing)
    })
  })

  describe('is circular-safe', function () {
    it('for one level with an object', function () {
      var o = {}
      o.o = o
      is(JSON.stringify(o), '{"o":"[Circular 1]"}')
    })

    it('for 2 levels with an array', function () {
      var o = {}
      o.a = [o]
      is(JSON.stringify(o), '{"a":["[Circular 2]"]}')
    })
  })

  describe('supports spacing', function () {
    it('in arrays', function () {
      is(JSON.stringify([1], null, '\t'), '[\n\t1\n]')
    })

    it('in objects', function () {
      is(JSON.stringify({a: 1}, null, ' '), '{\n "a": 1\n}')
    })
  })
})

function match (value) {
  var expected = global.JSON.stringify(value)
  var actual = JSON.stringify(value)
  is(actual, expected)
}
