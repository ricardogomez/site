'use strict';

var Metalsmith = require('metalsmith');
var resolve = require('path').resolve;
var exists = require('fs').existsSync;

module.exports = builder;

function normalize(obj){
  if (obj instanceof Array) return obj;
  var ret = [];

  for (var key in obj) {
    var plugin = {};
    // same plugin twice
    var name = key.split(':')[0]
    plugin[name] = obj[key];
    ret.push(plugin);
  }

  return ret;
}

function builder(dir) {
  var metalsmith = Metalsmith(dir);
  var config = resolve(dir, 'metalsmith.json');

  var json = require(config);
  if (json.source) metalsmith.source(json.source);
  if (json.destination) metalsmith.destination(json.destination);
  if (json.metadata) metalsmith.metadata(json.metadata);
  if (json.clean != null) metalsmith.clean(json.clean);

  normalize(json.plugins).forEach(function(plugin){
    for (var name in plugin) {
      try {
        var opts = plugin[name];
        var local = resolve(dir, name);
        var npm = resolve(dir, '../node_modules', name);
        var mod = null;

        if (exists(local))              mod = require(local);
        else if (exists(local + '.js')) mod = require(local);
        else if (exists(npm))           mod = require(npm);
        else                            mod = require(name);

        metalsmith.use(mod(opts));
      } catch (e) {
        console.log(e, e.stack);
        throw(e);
      }
    }
  });
  return metalsmith;

}
