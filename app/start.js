'use strict';

var Metalsmith = require('./lib/metalsmith-cli.js');
var chalk = require('chalk');

console.log(chalk.green("Hola papá!"));
var dir = __dirname;

var metalsmith = Metalsmith(dir);

metalsmith.build(function(err) {
  if (err) throw err;
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
