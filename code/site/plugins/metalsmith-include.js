"use strict";

var minimatch = require('minimatch');

module.export = function(options) {
  return function(files, metalsmith, done) {
    Object.keys(files).each(function(file) {
      if (minimatch(file, "*.md")) {
        var contents = files[file].contents;
        var pattern = new RegExp("!!\\s+incluye\\s+(.*)")
        contents.replace(pattern, function(element) {
          console.log("INCLUDE ", element)
        });
      }
    });
    done();
  }
};
