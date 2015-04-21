"use strict";

var fs = require('fs');
var minimatch = require('minimatch');

module.exports = function(options) {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var token = "!! incluye";
      if (minimatch(file, "**/*.md")) {
        if (!files[file]) return; // file deleted
        var matches = 0;
        var contents = files[file].contents.toString();
        var pattern = new RegExp(token.replace(/\s+/, "\\s+") + "\\s+(.*)", "g");
        var included = contents.replace(pattern, function(element, match) {
          matches++;
          var include = match.replace(/['"]+/g, '');
          var fragment = files[include];
          if (fragment) {
            fragment = fragment.contents.toString();
            delete files[include];
            return fragment;
          } else {
            // read the file directly (when using metalsmith-watch)
            var path = metalsmith.path(metalsmith.source() + "/" + include);
            if (fs.existsSync(path)) {
              return fs.readFileSync(path);
            } else {
              return "> Fichero: ''" + include + "' no encontrado (" + path + ")";
            }
          }
        });
        if (matches > 0) {
          files[file].contents = new Buffer(included);
        }
      }
    });
    done();
  }
};
