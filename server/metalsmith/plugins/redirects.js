
module.exports = plugin

function tmpl (destination) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="1;url=${destination}">
<link rel="canonical">
<script>window.location.replace("${destination}");</script>
</head>
<body>Esta página se movió <a href="${destination}">aquí.</a>
</body>
</html>`
}

function plugin (options) {
  return function (files, metalsmith, done) {
    var file = files[options.file]
    if (!file) return

    var lines = file.contents.toString().split('\n')
    lines.forEach(function (line) {
      var parts = line.replace(/\s/g, '').split(':')
      var original = parts[0].replace(/\"/g, '').substring(1)
      var source = original + '/index.html'
      if (original) {
        var redirect = tmpl('/' + parts[1])
        files[source] = {
          contents: new Buffer(redirect)
        }
      }
    })
    done()
  }
}
