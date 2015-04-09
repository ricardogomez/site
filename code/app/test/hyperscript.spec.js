'use strict';

var h = require('../lib/hyperscript.js')

describe('Hypertext', function() {
  it('creates a node', function() {
    expect(h('img')).toEqual('<img></img>');
  });

  it('node has attributes', function() {
    expect(h('img', {src: 'A'})).toEqual('<img src="A"></img>');
  });

  it('node has content', function() {
    expect(h('p', 'This is the text'));
  })

  it('can have childrens', function() {
    expect(h('div', [h('a'), h('b')])).toEqual('<div><a></a><b></b></div>');
  })
})
