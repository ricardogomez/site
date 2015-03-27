'use strict';

var options = require('./default-options');
var express = require('express');
var exphbs  = require('express-handlebars');
var chalk = require('chalk');


var defaults = {
  root: '.',
  port: 4567
}

function start(options) {
  var app = express();
  var view = exphbs.create({
    defaultLayout: 'app',
    layoutsDir: './app/views/layouts',
    // Specify helpers which are only registered on this instance.
    helpers: {
      foo: function () { return 'FOO!'; },
      bar: function () { return 'BAR!'; }
    }
  });
  app.engine('handlebars', view.engine);
  app.set('views', './app/views')
  app.set('view engine', 'handlebars');

  app.get('/editar', function (req, res) {
    res.render('editar');
  });

  app.get('/build', function(req, res) {
    console.log(chalk.blue("Re-construyendo la web..."));
    options.build(function(err) {
      if(err) throw(err);
      console.log(chalk.blue("Listo."));
      res.send("Listo.");
    })
  });

  app.use(express.static(options.root, { etag: false }));

  var server = app.listen(options.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Servidor listo. Abre http://%s:%s', host, port)
  });
  return server;
}

module.exports = {
  start: options(start, defaults)
}
