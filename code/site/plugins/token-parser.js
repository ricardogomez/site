'use strict'

module.exports = parse

function parse (token) {
  var cmd = {}
  cmd.token = token
  cmd.tokens = token
    .split('"')
    .map(function (x, i) {
      if (i % 2 === 1) { // in string
        return x.replace(/ /g, '!whitespace!')
      } else {
        return x
      }
    })
    .join('').split(/\s+/)
    .map(function (x) {
      return x.replace(/!whitespace!/g, ' ')
    })

  cmd.method = cleanTildes(cmd.tokens.shift())
  cmd.value = function () {
    return cmd.tokens[0]
  }
  cmd.option = function () {
    for (var name of arguments) {
      var idx = cmd.tokens.indexOf(name + ':')
      if (idx > 0) return cmd.tokens[idx + 1]
    }
    return ''
  }

  return cmd
}

var TILDES = {'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'}
var TILKEYS = Object.keys(TILDES)
function cleanTildes (method) {
  var m = method.toLowerCase()
  TILKEYS.forEach(function (key) {
    m = m.replace(TILDES[key], key)
  })
  return m
}
