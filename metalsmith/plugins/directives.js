var extname = require('path').extname
var START = '{{'
var CONTENT = '[^\\}]*'
var END = '}}'
var DIRECTIVE = new RegExp(START + '\\s*(' + CONTENT + ')\\s*' + END, 'gi')

function directives (list) {
  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (name) {
      if (!/\.html?/.test(extname(name))) return
      var content = files[name].contents.toString()

      data.contents = new Buffer(templ(content, function (token) {
        var cmd = parse(token)
        var helper = directives[cmd.method]
        helper = helper || function () { return token }
        return helper(cmd, files)
      }))
    })
    done()
  }
}

function isOption (token) { return /:$/.test(token) }
directives.parse = function (token) {
  var tokens = token.split('"')
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
  var directive = { name: cleanTildes(tokens[0]) }
  directive.value = (tokens[1] && !isOption(tokens[1])) ? tokens[1] : ''
  directive.options = tokens.reduce(function (opts, token, i) {
    if (isOption(token)) {
      var name = cleanTildes(token.slice(0, token.length - 1))
      opts[name] = tokens[i + 1]
    }
    return opts
  }, {})

  return directive
}

var TILDES = {'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'}
function cleanTildes (method) {
  return Object.keys(TILDES).reduce(function (m, key) {
    m = m.replace(TILDES[key], key)
    return m
  }, method.toLowerCase())
}

directives.process = function (content, processors) {
  if (content.indexOf(START) < 0) return
  content = content.replace(/&quot;/g, '"').replace(/\s+/g, '')
  content.replace(DIRECTIVE, function (tag, token) {
    var directive = directives.parse(token)
    var processor = processors[directive.method]
    return processor ? processor(directive) : token
  })
}

module.exports = directives
