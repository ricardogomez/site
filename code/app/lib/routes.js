'use strict';
var path = require('path');
var exec = require('child_process').exec;
var simpleGit = require('simple-git')

var ROOT = path.join(__dirname, '../../..');

var actions = {};
module.exports = function(app, metalsmith) {
  app.get('/editar', render('editar', actions.editar));
  app.get('/instrucciones', render('instrucciones'));
  app.get('/ver', render('ver', actions.documents));
  app.get('/publicar', render('publicar', actions.gitStatus));
  app.get('/deploy', deploy());
  app.get('/recrear', build(metalsmith));
  app.get('/editor', editor());
  app.get('/carpeta', folder());
  app.get('/ficheros', files());
}

function render(template, action) {
  action = action || function(done) { done(); };
  return function(req, res) {
    action(function(err, ctx) {
      res.render(template, ctx);
    });
  }
}

actions.editar = function(done) {
  done(null, { path: ROOT} );
}

actions.documents = function(done) {
  var git = simpleGit(ROOT);
  var path = "publicar/paginas";
  git.status(function(err, status) {
    var all = [].concat(status.modified).concat(status.not_added);
    var docs = all.filter(function(file) {
      return file.match(/publicar\/paginas/);
    }).map(function(file) {
      return file.slice(path.length, -3);
    });
    done(null, {docs: docs});
  });
}

actions.gitStatus = function(done) {
  var git = simpleGit(ROOT);
  git.status(done);
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
  var chalk = require('chalk');
  return function(req, res) {
    console.log(chalk.blue("Re-construyendo la web..."));
    metalsmith.build(function(err) {
      res.redirect('/editar');
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
