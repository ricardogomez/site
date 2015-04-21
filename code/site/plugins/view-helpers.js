'use strict'

var extname = require('path').extname;
var h = require('./hyperscript');
var templ = require('./templ');
var parse = require('./token-parser')

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
        helper = helper || function() { return token; }
        return helper(cmd, files);
      }));
    });
    done();
  }
}

function html(file){
  return /\.html?/.test(extname(file));
}
