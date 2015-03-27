'use strict';

var web = require('node-static');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

var defaults = {
  root: '.',
  cache: 0,
  port: 8080,
  host: "localhost",
  verbose: false,
  listDirectories: false,
  indexFile: "index.html"
};

var serve = function(options) {
  var docRoot = options.root;
  var fileServer = new web.Server(docRoot, { cache: options.cache, indexFile: options.indexFile });

  var server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {

      fileServer.serve(request, response, function(err, res) {
        if (err) {
          log(chalk.red("[" + err.status + "] " + request.url), true);

          response.writeHead(err.status, err.headers);
          response.end("Not found");

        } else if (options.verbose) {
          log("[" + response.statusCode + "] " + request.url, true);
        }
      });

    }).resume();

  })

  server.on('error', function (err) {
    if (err.code == 'EADDRINUSE') {
      log(chalk.red("Address " + options.host + ":" + options.port + " already in use"));
      throw err;
    }
  });

  server.listen(options.port, options.host);

  log(chalk.green("serving " + docRoot + " at http://" + options.host + ":" + options.port));
  return server;
}


function formatNumber(num) {
  return num < 10 ? "0" + num : num;
}

function log(message, timestamp) {
  var tag = chalk.blue("[metalsmith-serve]");
  var date = new Date();
  var tstamp = formatNumber(date.getHours()) + ":" + formatNumber(date.getMinutes()) + ":" + formatNumber(date.getSeconds());
  console.log(tag + (timestamp ? " " + tstamp : "") + " " + message);
}

module.exports = {
  start: function (options) {
    Object.keys(defaults).forEach(function(key) {
      if (!options[key]) {
        options[key] = defaults[key];
      }
    });

    return serve(options);
  }
}
