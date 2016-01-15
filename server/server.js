var express = require('express')
var repository = require('./repository')
var path = require('path')
var bodyParser = require('body-parser')
// file uploads
// var multer = require('multer')

// utility functions
function sendJSON (res, obj) { res.send(JSON.stringify(obj, null, 2)) }

var repo = repository(path.join(__dirname, '../publicar'))

// server with middleware
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, '../client')))
app.use('/ver', express.static(path.join(__dirname, '../build')))

// ROUTES
app.get('/v1/files', function (req, res) {
  repo.files(function (err, files) {
    if (err) throw err
    sendJSON(res, files)
  })
})

app.get('/v1/page/*', function (req, res) {
  console.log('GET PAGE', req.params)
  var name = req.params[0]
  repo.getPage(name, function (err, content) {
    if (err) res.status(500).send('Page not found.')
    else sendJSON(res, { name: name, content: content.toString() })
  })
})

app.put('/v1/page', function (req, res) {
  const name = req.body.name
  const content = req.body.content
  repo.updatePage(name, content, function (err) {
    if (err) res.status(500).send("Can't update page.")
    else sendJSON(res, { name, content })
  })
})

app.listen(3000, function () {
  console.log('HTML: http://localhost:3000')
  console.log('GET: http://localhost:3000/v1/files')
  console.log('GET: http://localhost:3000/v1/page/*')
  console.log('PUT: http://localhost:3000/v1/page')
})
