module.exports = plugin

function plugin () {
  return function (files, metalsmith, done) {
    console.log('Metalsmith logger')
    done()
  }
}
