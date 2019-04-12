'use strict'
/* global describe it */
var JSON = require('../lighter-json')
var is = global.is || require('exam/lib/is')

describe('scriptify', function () {
  it('has a default maximum depth of 5', function () {
    var a = JSON.scriptify([[[[[[]]]]]])
    var o = JSON.scriptify([[[[[{}]]]]])
    is(a, '[[[[["[Array]"]]]]]')
    is(o, '[[[[["[Object]"]]]]]')
  })

  it('defaults to including prototype properties', function () {
    var Thing = function () {}
    Thing.prototype.hi = 'Hi!'
    var thing = new Thing()
    thing.ok = true
    var p = JSON.scriptify(thing)
    var o = JSON.scriptify(thing, {ownOnly: true})
    is(p, '{ok:true,hi:"Hi!"}')
    is(o, '{ok:true}')
  })

  describe('equality', function () {
    it('works for undefined', function () {
      equate(undefined)
    })

    it('works for null', function () {
      equate(null)
    })

    it('works for booleans', function () {
      equate(true)
      equate(false)
      equate(new Boolean()) // eslint-disable-line
    })

    it('works for numbers', function () {
      equate(1)
      equate(0)
      equate(1.1)
      equate(-1)
      equate(1e6)
      equate(1e99)
      equate(Infinity)
      equate(NaN)
      equate(new Number()) // eslint-disable-line
    })

    it('works for strings', function () {
      equate('hi')
      equate('"hi"')
      equate('\t"hi"\n')
      equate('hi\r\n')
      equate('hi\\you')
      equate('"hi\\you\\"')
      equate('\0\b\n\f\r\t')
      equate(new String()) // eslint-disable-line
    })

    it('works for functions', function () {
      is(JSON.scriptify(function () {}), 'function () {}')
    })

    it('works for objects', function () {
      equate({'0': 1, a: 2, '*': 3})
      equate({'\t': 'tab', '\r': 'cr', '\n': 'lf', "'": 'quot', '\\': 'backslash'})
      equate({a: 1, f: function () {}, b: 2})
      equate({u: undefined})
    })

    it('works for arrays', function () {
      equate([1, 2, 3])
      equate([undefined])
    })

    it('works for dates', function () {
      equate(new Date())
    })

    it('works for errors', function () {
      equate(new Error('NonIssueError: This is not an issue.'))
    })

    it('works for regular expressions', function () {
      equate(/a/)
      equate(new RegExp('flags', 'gmi'))
    })

    it('works for objects with prototypes', function () {
      var Thing = function () {}
      Thing.prototype.hi = 'Hi!'
      var thing = new Thing()
      thing.ok = true
      equate(thing)
    })
  })

  describe('is circular-safe', function () {
    it('for one level with an object', function () {
      var o = {}
      o.o = o
      is(JSON.scriptify(o), '{o:{"^":1}}')
    })

    it('for 2 levels with an array', function () {
      var o = {}
      o.a = [o]
      is(JSON.scriptify(o), '{a:[{"^":2}]}')
    })
  })
})

function equate (value, options) {
  var scriptified = JSON.scriptify(value, options)
  var evaluated = JSON.evaluate(scriptified)
  var rescriptified = JSON.scriptify(evaluated, options)
  is(scriptified, rescriptified)
}
