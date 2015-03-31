'use strict'

var extname = require('path').extname;
var h = require('../lib/hyperscript');
var templ = require('../lib/templ');

module.exports = plugin;

var helpers = {};

// IMAGEN path posición: cen | izq | der texto: cosas
helpers.imagen = function(cmd) {
  var url = "/imagenes/" + cmd.value();
  var texto = cmd.options('texto');
  var pos = cmd.options('pos', 'posición', 'posicion');

  return h('img', { "src": url, "alt": texto,
    "class": "image-helper-position-" + pos})
}

// LIBRO imágen: ... página: ...
helpers.libro = function(cmd) {
  var title = cmd.value();
  var url = "/mislibros/" + cmd.options('pagina', 'página');
  var thumb = "/imagenes/mislibros/" + cmd.options('imagen', 'imágen');

  return h('a', {href: url, }, [
    h('img', {"src": thumb, "alt": title, "class": "book"})
  ]);
}
helpers.salto = function(cmd) {
  return h('div', {"class": "clearfix"})
}

var ctx = templ.helpers(helpers, function(path, options, complete) {
  return h('p', {style: 'border: 1px solid red;'}, complete)
});

function plugin() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(name) {
      if (!html(name)) return;
      var data = files[name];
      var template = data.contents.toString();
      template = template.replace(/&quot;/g, '"');
      data.contents = new Buffer(templ(template, ctx));
    });
    done();
  }
}

function html(file){
  return /\.html?/.test(extname(file));
}
