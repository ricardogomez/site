/* global describe it */

var assert = require('assert')
var process = require('../plugins/directives').process
var processors = require('../processors')

describe('imagen processor', () => {
  it('with options', () => {
    assert.equal(process('{{ imágen path/to/image.gif pos: izq texto: "La imágen" }}', processors),
      '<img src="/imagenes/imagen" alt="La imágen" class="image-helper-position-izq"></img>')
  })
  it('default options', () => {
    assert.equal(process('{{ imágen path/to/image.gif}}', processors),
      '<img src="/imagenes/imagen" alt="" class="image-helper-position-izq"></img>')
  })
})

describe('libro processor', () => {
  it('with options', () => {
    assert.equal(process('{{ libro imágen: path/image.gif página: la-pagina }}', processors),
      '<a href="/mislibros/la-pagina"><img src="/imagenes/mislibros/path/image.gif" alt="libro" class="book"></img></a>')
  })
})

describe('salto processor', () => {
  it('default options', () => {
    assert.equal(process('{{ salto }}', processors),
      '<div class="clearfix"></div>')
  })
})
