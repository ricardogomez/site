// rsync -avz --progress /Users/Dani/Code/Node/ricardogomez.com/app/build/* deployer@ricardogomez.com:/home/deployer/ricardogomez.com

var Rsync = require('rsync');
var path = require('path');

var source = __dirname + "../build/";
var destination = '/home/deployer/ricardogomez.com';
var host = "ricardogomez.com"
var user = 'deployer'

console.log("Source: ", source);

var rsync = Rsync.build({
    'flags': 'avz progress',
    'shell': 'ssh',
    'source': path.join(__dirname, '../build/'),
    'destination': 'deployer@ricardogomez.com:/home/deployer/ricardogomez.com'
});

rsync.execute(function(error, code, cmd) {
  console.log("Rsync done", cmd, code, error);
});
