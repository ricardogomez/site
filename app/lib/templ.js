'use strict';

var START = "{{"
var CONTENT = "[^\\}]*"
var END = "}}"
var pattern = new RegExp(START + "\\s*("+ CONTENT +")\\s*" + END, "gi");


function render(templ, context) {
  templ = templ.replace(/\s+/g, " ");
  return templ.replace(pattern, function(tag, token) {
    return context(token);
  });
}

function parse(token) {
  var cmd = {};
  cmd.token = token;
  cmd.tokens = token
    .split('"')
    .map(function(x, i) {
      if (i % 2 === 1) { // in string
        return x.replace(/ /g, "!whitespace!");
      } else {
        return x;
      }
    })
    .join('').split(/\s+/)
    .map(function(x) {
      return x.replace(/!whitespace!/g, " ");
    });

  cmd.method = clean(cmd.tokens.shift());
  cmd.value = function() {
    return cmd.tokens[0];
  }
  cmd.options = function() {
    for(var name of arguments) {
      var idx = cmd.tokens.indexOf(name + ":");
      if (idx > 0) return cmd.tokens[idx + 1];
    }
    return "";
  }

  return cmd;
}

render.helpers = function(helpers, delegate) {
  return function(token) {
    var cmd = parse(token);

    var helper = null;
    if (helpers[cmd.method]) helper = helpers[cmd.method];
    else if(delegate) helper = delegate;
    else helper = function() {}

    return helper(cmd);
  }
}

var TILDES = {'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'};
var TILKEYS = Object.keys(TILDES);
function clean(method) {
  var m = method.toLowerCase();
  TILKEYS.forEach(function(key) {
    m = m.replace(TILDES[key], key);
  });
  return m;
}

module.exports = render;
