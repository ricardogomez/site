'use strict';

var Metalsmith = require('./lib/metalsmith-cli.js');
var chalk = require('chalk');
var path = require('path');

console.log(chalk.green("Hola papá!"));

var site = path.join(__dirname, '../site');

var metalsmith = Metalsmith(site);

metalsmith.build(function(err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(chalk.green("Web lista."));
});

if ("server") {
  console.log(chalk.yellow("Iniciando servidor..."));
  var server = require('./lib/server.js')
  server.start({
    "metalsmith": metalsmith,
  });
}

console.log("Pulsa Ctrl+C para parar.")
