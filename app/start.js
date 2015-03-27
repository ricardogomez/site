'use strict';

var Metalsmith = require('./lib/metalsmith-cli.js');
var chalk = require('chalk');

console.log(chalk.green("Hola!"));
var dir = __dirname;

function build(done) {
  var metalsmith = Metalsmith(dir);
  console.log(chalk.yellow("Construyendo la web..."));
  metalsmith.build(done);
  return metalsmith.destination();
}

var output = build(function(err) {
  if (err) throw err;
  console.log(chalk.blue("web en: " + output));
});

if ("server") {
  console.log(chalk.yellow("Iniciando servidor..."));
  var server = require('./lib/server.js')
  server.start({
    "build": build,
    "root": output
  });
}

console.log("Pulsa Ctrl+C para parar.")
