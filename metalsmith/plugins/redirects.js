'use strict'

var templ = require('./templ')

module.exports = plugin

var t = '<!DOCTYPE html>' +
  '<html>' +
  '<head>' +
  '<meta charset="utf-8">' +
  '<meta http-equiv="refresh" content="1;url={{destination}}">' +
  '<link rel="canonical">' +
  '<script>window.location.replace("{{destination}}");</script>' +
  '</head>' +
  '<body>Esta página se movió <a href="{{destination}}">aquí.</a>' +
  '</body>' +
  '</html>'

function plugin (options) {
  return function (files, metalsmith, done) {
    var file = files[options.file]
    if (!file) return

    var lines = file.contents.toString().split('\n')
    lines.forEach(function (line) {
      var parts = line.replace(/\s/g, '').split(':')
      var original = parts[0].replace(/\"/g, '').substring(1)
      var source = original + '/index.html'
      var dest = '/' + parts[1]
      if (original) {
        var redirect = templ(t, function () { return dest })
        files[source] = {
          contents: new Buffer(redirect)
        }
      }
    })
    done()
  }
}
