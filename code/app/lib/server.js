'use strict';

var options = require('./default-options');
var express = require('express');
var exphbs  = require('express-handlebars');
var chalk = require('chalk');
var path = require('path');


var defaults = {
  metalsmith: null,
  // server port
  port: 4567
}

function start(options) {
  var metalsmith = options.metalsmith;

  var app = express();
  var view = exphbs.create({
    defaultLayout: 'app',
    layoutsDir: './code/app/views/layouts',
    // Specify helpers which are only registered on this instance.
    helpers: {
      foo: function () { return 'FOO!'; },
      bar: function () { return 'BAR!'; }
    }
  });
  app.engine('handlebars', view.engine);
  app.set('views', './code/app/views')
  app.set('view engine', 'handlebars');

  var readdir = require('recursive-readdir');
  app.get('/editar', function (req, res) {
    var src = path.join(metalsmith.source(), '../imagenes');
    var srcLen = src.length;
    readdir(src, function (err, arr) {
      var files = err ? [] : arr;
      files = files.map(function(file) {
        return { path: file.slice(srcLen, -1), file: file }
      });
      res.render('editar', { files: files});
    });
  });

  app.get('/publicar', function (req, res) {
    res.render('publicar');
  });

  app.get('/build', function(req, res) {
    console.log(chalk.blue("Re-construyendo la web..."));
    metalsmith.build(function(err) {
      res.send(err ? "Error." : "Listo.");
    })
  });

  app.use(express.static(metalsmith.destination(), { etag: false }));
  var assets = path.join(__dirname, '../assets')
  app.use(express.static(assets));

  var server = app.listen(options.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Servidor listo. Abre http://localhost:%s', port)
  });
  return server;
}

module.exports = {
  start: options(start, defaults)
}
