'use strict'
/* global describe it */
var JSON = require('../lighter-json')
var is = global.is || require('exam/lib/is')
var Readable = require('stream').Readable
var stream = new Readable()
stream.resume = function () {}
stream._read = function () {}

describe('JSON.reader', function () {
  it('causes a stream to emit objects', function (done) {
    JSON.reader(stream).on('object', function (o) {
      is.same(o, {ok: true})
      JSON.unreader(stream)
      is(stream._jsonData, undefined)
      done()
    })
    is(stream._jsonData, '')
    stream.emit('data', '{ok:true}\n')
  })

  it('emits errors upon reading invalid JSON', function (done) {
    JSON.reader(stream).on('error', function (e) {
      is.error(e)
      JSON.unreader(stream)
      done()
    })
    stream.emit('data', 'I am not JSON\n')
  })
})

describe('JSON.writer', function () {
  it('makes a stream object-writable', function (done) {
    var write = function (data) {
      is(data, '1\n')
      JSON.unwriter(stream)
      is(stream.write, write)
      done()
    }
    var stream = {
      write: write
    }
    JSON.writer(stream)
    stream.write(1)
  })
})
