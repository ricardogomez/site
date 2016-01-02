var fs = require('fs')
var path = require('path')

const ROOT = path.join(__dirname, '../../publicar')
const OUTPUT = path.join(__dirname, 'files.json')
console.log(ROOT)

walk(ROOT, function (err, results) {
  if (err) throw err
  var len = ROOT.length
  var names = results
    .map(name => name.substring(len))
    .filter(name => /\.md$/.exec(name))
  fs.writeFileSync(OUTPUT, JSON.stringify(names, null, 2))
  console.log(names)
})

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
