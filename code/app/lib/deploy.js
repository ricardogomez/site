// rsync -avz --progress /Users/Dani/Code/Node/ricardogomez.com/app/build/* deployer@ricardogomez.com:/home/deployer/ricardogomez.com

var path = require('path');
var exec = require('child_process').exec;

var source = path.join(__dirname, "../../site/build/");
var destination = 'deployer@ricardogomez.com:/home/deployer/ricardogomez.com';

console.log("Source: ", source);

var rsync = 'rsync -avz ' + source + '* ' + destination

console.log("Execute", rsync);

var child = exec(rsync, function(error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
