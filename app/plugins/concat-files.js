'use strict';

var fs = require('fs');
var async = require('async');

module.exports = plugin;

function buildBundle(bundle, done) {
  var paths = bundle.files.map(function(file) {
    return bundle.base + "/" + file;
  });
  async.mapSeries(paths, fs.readFile, function(err, results) {
    var content = results.reduce(function(memo, buffer) {
      return memo + buffer.toString();
    }, "");
    done(null, { file: bundle.output, content: content });
  });
}

function plugin(options) {
  return function(files, metalsmith, done) {
    var bundles = Object.keys(options).map(function(output) {
      var bundle = options[output];
      bundle.output = output;
      bundle.base = metalsmith.path(bundle.base);
      return bundle;
    });

    async.mapSeries(bundles, buildBundle, function(err, results) {
      results.forEach(function(result) {
        files[result.file] = {
          contents: new Buffer(result.content)
        };
      });
      done();
    });
  }
}
