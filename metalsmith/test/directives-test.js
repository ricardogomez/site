/* global describe it */

var assert = require('assert')
var directives = require('../plugins/directives')

describe('directives tag', () => {
  const tag = directives.tag
  it('creates empty tag', () => {
    assert.equal(tag('img'), '<img></img>')
  })
  it('creates tag with attributes', () => {
    assert.equal(tag('img', { src: 'server', alt: 'text' }),
      '<img src="server" alt="text"></img>')
  })
  it('creates tag with children', () => {
    assert.equal(tag('a', null, [ tag('img', { src: 'file.gif' }) ]),
      '<a><img src="file.gif"></img></a>')
  })
})

describe('process directives', () => {
  const process = directives.process
  it('with one simple directive', () => {
    function photo (dir, h) { return h('img', { src: dir.value, alt: dir.options['alt'] }) }
    assert.equal(process('Hola {{ photo one ált: 2 }} que tal', { photo }),
      'Hola <img src="one" alt="2"></img> que tal')
  })
  it('with one realistic directive', () => {
    function libro (dir, h) {
      var title = dir.name
      var url = '/mislibros/' + dir.options['pagina']
      var thumb = '/imagenes/mislibros/' + dir.options['imagen']

      return h('a', {href: url}, [
        h('img', {'src': thumb, 'alt': title, 'class': 'book'})
      ])
    }
    assert.equal(process('Hola {{ libro página: la-pagina imágen: "la imágen.gif"}}', { libro }),
      'Hola <a href="/mislibros/la-pagina"><img src="/imagenes/mislibros/la imágen.gif" alt="libro" class="book"></img></a>')
  })
})

describe('parse directives', () => {
  const parse = directives.parse
  it('with name value and options', () => {
    assert.deepEqual(parse('name "The value" op1: "op 1" op2: "op 2"'),
    { name: 'name', value: 'The value', options: { op1: 'op 1', op2: 'op 2' } })
  })
  it('with name', () => {
    assert.deepEqual(parse('metodo'), { name: 'metodo', value: '', options: {} })
  })
  it('with value', () => {
    assert.deepEqual(parse('open blah'), { name: 'open', value: 'blah', options: {} })
  })
  it('with options', () => {
    assert.deepEqual(parse('met number: 1 rep: 3'),
      { name: 'met', value: '', options: { 'number': '1', 'rep': '3' } })
  })
  it('with spaces', () => {
    assert.deepEqual(parse('método "with spaces" value: "blah 2"'),
      { name: 'metodo', value: 'with spaces', options: { value: 'blah 2' } })
  })
  it('with tildes', () => {
    assert.deepEqual(parse('método Value orientación: izq'),
      { name: 'metodo', value: 'Value', options: { orientacion: 'izq' } })
  })
})
