var fs = require('fs')
var path = require('path')

module.exports = function (ROOT) {
  return {
    files: createFilesObject(ROOT),
    page: getPage(ROOT)
  }
}

function getPage (ROOT, name, done) {
  if (arguments.length === 1) return function (n, cb) { return getPage(ROOT, n, cb) }
  name = name.replace('inicio/', '')
  fs.readFile(path.join(ROOT, 'paginas', name), done)
}

function createFilesObject (ROOT, done) {
  if (arguments.length === 1) return function (cb) { return createFilesObject(ROOT, cb) }
  walk(ROOT, function (err, results) {
    if (err) done(err, null)
    var len = ROOT.length
    var names = results.map(name => name.substring(len))
    var pageNames = names.filter(name => /^\/paginas/.test(name))
    .map(name => name.substring('/paginas/'.length))
    var pages = pageNames.reduce(function (sections, name) {
      const i = name.indexOf('/')
      if (i < 0) sections['inicio'].push(name)
      else {
        var sec = name.substring(0, i)
        sections[sec] = sections[sec] || []
        sections[sec].push(name.substring(i + 1))
      }
      return sections
    }, { inicio: [] })
    done(null, pages)
  })
}

function walk (dir, done) {
  var results = []
  fs.readdir(dir, function (err, list) {
    if (err) return done(err)
    var pending = list.length
    if (!pending) return done(null, results)
    list.forEach(function (file) {
      file = path.resolve(dir, file)
      fs.stat(file, function (err, stat) {
        if (err) throw err
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            if (err) throw err
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })
}
