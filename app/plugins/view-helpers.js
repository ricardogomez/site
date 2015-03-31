'use strict'

var extname = require('path').extname;
var h = require('../lib/hyperscript');
var templ = require('../lib/templ');
var parse = require('../lib/token-parser')

module.exports = plugin;

var helpers = {};

// IMAGEN path posición: cen | izq | der texto: cosas
helpers.imagen = function(cmd) {
  var url = "/imagenes/" + cmd.value();
  var texto = cmd.option('texto');
  var pos = cmd.option('pos', 'posición', 'posicion');

  return h('img', { "src": url, "alt": texto,
    "class": "image-helper-position-" + pos})
}

// LIBRO imágen: ... página: ...
helpers.libro = function(cmd) {
  var title = cmd.value();
  var url = "/mislibros/" + cmd.option('pagina', 'página');
  var thumb = "/imagenes/mislibros/" + cmd.option('imagen', 'imágen');

  return h('a', {href: url, }, [
    h('img', {"src": thumb, "alt": title, "class": "book"})
  ]);
}

helpers.salto = function(cmd) {
  return h('div', {"class": "clearfix"})
}

helpers.incluye = function(cmd, files) {
  var path = cmd.value().split('/');
  var last = path.length - 1;
  path[last] = '_' + path[last] + '.html';
  var partial = path.join('/');

  var file = files[partial];
  var content = file ? file.contents.toString() :
    "Fichero: " + partial + " no encontrado."

  return content;
}

function plugin() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(name) {
      if (!html(name)) return;
      var data = files[name];
      var template = data.contents.toString();
      template = template.replace(/&quot;/g, '"');

      data.contents = new Buffer(templ(template, function(token) {
        var cmd = parse(token);
        var helper = helpers[cmd.method];
        helper = helper || function() {
          return h('p', {"style": "border: 1px solid red;" }, token);
        }
        return helper(cmd, files);
      }));
    });
    done();
  }
}

function html(file){
  return /\.html?/.test(extname(file));
}
