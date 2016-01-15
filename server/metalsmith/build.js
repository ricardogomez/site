
var Builder = require('.')
var builder = Builder('../../publicar/paginas', '../../build')

console.log('Building:', builder.source())
builder.build(function (err) {
  if (err) throw err
  console.log('Done:', builder.destination())
})
