
var builder = require('.')()

console.log('Building:', builder.source())
builder.build(function (err) {
  if (err) throw err
  console.log('Done:', builder.destination())
})
