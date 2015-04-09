'use strict'
var minimatch = require("minimatch")

module.exports = plugin;

function plugin() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(name) {
      if (!minimatch(name, "**/*.md")) return;

      var data = files[name];
      data.section = name.split('/')[0];
    });
    done();
  }
}

function html(file){
  return /\.html?/.test(extname(file));
}
