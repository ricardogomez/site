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
    var cmd = parse(token);

    var helper = null;
    if (helpers[cmd.method]) helper = helpers[cmd.method];
    else if(delegate) helper = delegate;
    else helper = function() {}

    return helper(cmd);
  }
}


module.exports = render;
