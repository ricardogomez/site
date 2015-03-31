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

render.helpers = function(helpers, delegate) {
  return function(token) {

    var tokens = token
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

    var method = clean(tokens.shift());
    var value = tokens.shift();
    var options = optionize(tokens);

    var helper = null;
    if (helpers[method]) helper = helpers[method];
    else if(delegate) helper = delegate;
    else helper = function() {}

    return helper(value, options, token);
  }
}

function optionize(array) {
  var opts = options({});
  if(array == null || array.length === 0) return opts;
  if(array.length % 2 === 1) array.push('');

  return array.reduce(function(hash, value, i, values) {
    if(i % 2 === 0) hash[clean(value.replace(':', ''))] = values[i + 1];
    return hash;
  }, opts);
}
function options(opts) {
  opts.alias = function(names, value) {
    for(var name in names) {
      if(opts[name]) return opts[name];
    }
    return value;
  }
  return opts;
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
