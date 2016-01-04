/* global describe it */

var assert = require('assert')
var directives = require('../plugins/directives')

describe('parse directive', function () {
  it('with name', function () {
    var directive = directives.parse('metodo')
    assert.deepEqual(directive, { name: 'metodo', value: '', options: {} })
  })
  it('with value', function () {
    var directive = directives.parse('open blah')
    assert.deepEqual(directive, { name: 'open', value: 'blah', options: {} })
  })
  it('with options', function () {
    var directive = directives.parse('met val number: 1 rep: 3')
    assert.deepEqual(directive, { name: 'met', value: 'val',
      options: { 'number': '1', 'rep': '3' } })
  })
  it('with quotes', function () {
    var directive = directives.parse('método "with spaces" value: "blah 2"')
    assert.deepEqual(directive, { name: 'metodo', value: 'with spaces',
      options: { value: 'blah 2' } })
  })
  it('with tildes', function () {
    var directive = directives.parse('método Value orientación: izq')
    assert.deepEqual(directive, { name: 'metodo', value: 'Value',
      options: { orientacion: 'izq' } })
  })
})
