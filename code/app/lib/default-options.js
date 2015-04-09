'use strict';

module.exports = function (func, defaults) {
  return function(options) {
    Object.keys(defaults).forEach(function(key) {
      if (!options[key]) {
        options[key] = defaults[key];
      }
    });
    return func(options);
  }
}
