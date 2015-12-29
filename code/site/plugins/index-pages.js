'use strict'
var extname = require('path').extname

// Index Pages
// ===========

module.exports = plugin

function plugin () {
  var name = 'paginas.html'

  return function (files, metalsmith, done) {
    var output = {}
    output.content = ''

    Object.keys(files).forEach(function (file) {
      if (html(file)) {
        output.content += '<a>' + file + '</a><br>'
      }
    })

    files[name] = output
    done()
  }
}

function html (file) {
  return /\.html?/.test(extname(file))
}
