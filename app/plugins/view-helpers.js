'use strict'

var extname = require('path').extname;
var h = require('../lib/hyperscript');
var templ = require('../lib/templ');

module.exports = plugin;

var helpers = {};
helpers.imagen = function(path, options) {
  var url = "/imagenes/" + path;
  var texto = options['texto'];
  var pos = "image-helper-position-" + options['posicion'];

  return h('img', { "src": url, "alt": texto, "class": pos})
}
helpers.libro = function(title, options) {
  var url = "/mislibros/" + options['pagina'];
  var thumb = "/imagenes/mislibros/" + options['imagen'];

  return h('a', {href: url, }, [
    h('img', {"src": thumb, "alt": title, "class": "book"})
  ]);
}
helpers.salto = function() {
  return h('div', {"class": "clearfix"})
}

// IMAGEN path posición: cen | izq | der texto: cosas
var ctx = templ.helpers(helpers, function(path, options, complete) {
  return h('p', {style: 'border: 1px solid red;'}, complete)
});

function plugin() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(name) {
      if (!html(name)) return;
      var data = files[name];
      var template = data.contents.toString();
      data.contents = new Buffer(templ(template, ctx));
    });
    done();
  }
}

function html(file){
  return /\.html?/.test(extname(file));
}
