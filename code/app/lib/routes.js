'use strict';
var path = require('path');
var exec = require('child_process').exec;
var simpleGit = require('simple-git')

var ROOT = path.join(__dirname, '../../..');

module.exports = function(app, metalsmith) {
  app.get('/editar', render('editar', { path: ROOT }));
  app.get('/instrucciones', render('instrucciones'));
  app.get('/publicar', state());
  app.get('/deploy', deploy());
  app.get('/build', build(metalsmith));
  app.get('/editor', editor());
  app.get('/carpeta', folder());
  app.get('/ficheros', files());
}

function render(template, ctx) {
  return function(req, res) {
    res.render(template, ctx);
  }
}

function state() {
  var git = simpleGit(ROOT);
  return function(req, res) {
    git.status(function(err, status) {
      res.render('publicar', status);
    });
  }
}

function deploy() {
  var buildPath = path.join(__dirname, "../../site/build/");
  var destination = 'deployer@ricardogomez.com:/home/deployer/ricardogomez.com';
  var rsync = 'rsync -az ' + buildPath + '* ' + destination;
  return function (req, res) {
    console.log("Publicando a: ", destination);
    exec(rsync, function(error, stdout, stderr) {
      console.log("Publicado: ", stdout);
      res.send(stdout);
    });
  }
}

function editor() {
  var paginasPath = path.join(ROOT, 'publicar/paginas');
  return function(req, res) {
    exec('atom ' + paginasPath, function(error, stdout, stderr) {
      res.send("Abriendo editor...");
    });
  }
}

function folder() {
  return function(req, res) {
    exec('open ' + path.join(ROOT, 'publicar'), function() {
      res.redirect('/editar');
    });
  }
}

function build(metalsmith) {
  return function(req, res) {
    console.log(chalk.blue("Re-construyendo la web..."));
    metalsmith.build(function(err) {
      res.send(err ? "Error." : "Listo.");
    });
  }
}

function files() {
  var readdir = require('recursive-readdir');
  return function (req, res) {
    var src = path.join(metalsmith.source(), '../imagenes');
    var srcLen = src.length;
    readdir(src, function (err, arr) {
      var files = err ? [] : arr;
      files = files.map(function(file) {
        return { path: file.substring(srcLen), file: file }
      });
      res.render('ficheros', { files: files});
    });
  }
}
