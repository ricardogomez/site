
module.exports = function() {
  var node = arguments[0];
  var atts = "";
  var inside = "";
  if (arguments.length > 1) {
    var next = arguments[1];
    if (isString(next)) {
      inside = next.toString();
    } else if (isArray(next)) {
      inside = children(next);
    } else {
      atts = attributes(next);
    }
    if(arguments.length > 2) {
      next = arguments[2];
      if (isArray(next)) {
        inside = children(next);
      } else if (isString(next)) {
        inside = next.toString();
      }
    }
  }
  return "<" + node + atts + ">" + inside + "</" + node + ">";
}

function attributes(object) {
  var atts = [];
  Object.keys(object).forEach(function(key) {
    atts.push(key + '="' + object[key] + '"');
  });
  return " " + atts.join(' ');
}

function children(obj) {
  return obj.join('');
}

function isArray(obj) { return Array.isArray(obj); }
function isString(obj) {
  return (typeof obj == 'string' || obj instanceof String);
}
