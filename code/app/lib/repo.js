'use strict';

var path = require('path');

var src = path.join(__dirname, '../../..');
var git = require('simple-git')(src);

git.status(function(err, status) {
  console.log(status);
});
