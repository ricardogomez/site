'use strict';

var fs = require('fs');
var async = require('async')

function concatFiles(base, files, output) {
  
}

function plugin(options) {
  return function(files, metalsmith, done) {
    var base = metalsmith.path(options.source);

    var paths = options.files.map(function(file) {
      return base + "/" + file + ".css";
    });
    async.mapSeries(paths, fs.readFile, function(err, results) {
      var css = results.reduce(function(memo, buffer) {
        return memo + buffer.toString();
      }, "");
      files[options.output] = {
        contents: new Buffer(css)
      };
      done();
    });
  }
}

module.exports = plugin;
