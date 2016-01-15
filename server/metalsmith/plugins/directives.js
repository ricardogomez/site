var extname = require('path').extname

/**
 * the metalsmith plugin
 */
function directives (processors) {
  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (name) {
      if (!/\.html?/.test(extname(name))) return
      var file = files[name]
      var result = directives.process(file.contents.toString(), processors)
      file.contents = new Buffer(result)
    })
    done()
  }
}

var START = '{{'
var CONTENT = '[^\\}]*'
var END = '}}'
var DIRECTIVE = new RegExp(START + '\\s*(' + CONTENT + ')\\s*' + END, 'gi')
/*
 * process a content with processors (see tests)
 */
directives.process = function (content, processors) {
  if (content.indexOf(START) < 0) return content
  content = content.replace(/&quot;/g, '"').replace(/\s+/g, ' ')
  return content.replace(DIRECTIVE, function (tag, token) {
    var directive = directives.parse(token)
    var processor = processors[directive.name]
    return processor ? processor(directive, directives.tag) : token
  })
}

/**
 * Parse a directive: {{ name "the value" opt1: "op 1" op2: "op 2" }}
 */
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
function isOption (token) { return /:$/.test(token) }
var TILDES = {'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'}
function cleanTildes (method) {
  return Object.keys(TILDES).reduce(function (m, key) {
    return m.replace(TILDES[key], key)
  }, method.toLowerCase())
}

directives.tag = function (name, attributes, children) {
  var atts = Object.keys(attributes || {}).reduce(function (s, name) {
    return s + name + '="' + attributes[name] + '" '
  }, ' ')
  var inner = (children || []).join('')
  return ('<' + name + atts + '>' + inner + '</' + name + '>').replace(' >', '>')
}

module.exports = directives
