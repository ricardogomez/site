'use strict';

var express = require('express');
var exphbs  = require('express-handlebars');
var chalk = require('chalk');
var path = require('path');

var options = require('./default-options');
var routes = require('./routes');

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

  routes(app, metalsmith);

  app.use(express.static(metalsmith.destination(), { etag: false }));
  var assets = path.join(__dirname, '../assets')
  app.use(express.static(assets));

  var server = app.listen(options.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Servidor listo. Abre http://localhost:%s/editar', port)
  });
  return server;
}

module.exports = {
  start: options(start, defaults)
}
