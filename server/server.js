var express = require('express')
var repository = require('./repository')
var path = require('path')

function sendJSON (res, obj) { res.send(JSON.stringify(obj, null, 2)) }

var app = express()
var repo = repository(path.join(__dirname, '../publicar'))

app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/v1/files', function (req, res) {
  repo.files(function (err, files) {
    if (err) throw err
    sendJSON(res, files)
  })
})

app.get('/v1/page/*', function (req, res) {
  console.log('page!', req.params)
  var name = req.params[0]
  repo.page(name, function (err, content) {
    if (err) sendJSON(res, { error: err })
    else sendJSON(res, { name: name, content: content.toString() })
  })
})

app.listen(3000, function () {
  console.log('http://localhost:3000')
  console.log('http://localhost:3000/v1/files')
})
