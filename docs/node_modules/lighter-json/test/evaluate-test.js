'use strict'
/* global describe it */
var JSON = require('../lighter-json')
var is = global.is || require('exam/lib/is')

describe('JSON.evaluate', function () {
  it('creates arrays', function () {
    var a = JSON.evaluate('[1,2,3]')
    is.array(a)
  })

  it('throws errors', function (done) {
    var x = 'i will not run'
    try {
      var y = JSON.evaluate(x)
    } catch (e) {
      is(y, undefined)
      done()
    }
  })
})
