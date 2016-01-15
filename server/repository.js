var fs = require('fs')
var path = require('path')

module.exports = function (ROOT) {
  return {
    files: apply(ROOT, createFilesObject),
    getPage: apply(ROOT, getPage),
    updatePage: apply(ROOT, updatePage)
  }
}

function apply (root, fn) {
  return function (a, b, c, d) { return fn(root, a, b, c, d) }
}

function updatePage (ROOT, name, content, done) {
  const file = path.join(ROOT, 'paginas', name.replace('inicio/', ''))
  fs.writeFile(file, content, 'utf-8', done)
}

function getPage (ROOT, name, done) {
  const file = path.join(ROOT, 'paginas', name.replace('inicio/', ''))
  fs.readFile(file, done)
}

function createFilesObject (ROOT, done) {
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
