var minimatch = require('minimatch')
var Metalsmith = require('metalsmith')

// plugins
var markdown = require('metalsmith-markdown')
var assets = require('metalsmith-assets')
var layouts = require('metalsmith-layouts')
var partial = require('metalsmith-partial')
var permalinks = require('metalsmith-permalinks')
var redirects = require('./plugins/redirects')
var includes = require('./plugins/includes')
var directives = require('./plugins/directives')
var processors = require('./processors')
var concat = require('./plugins/concat')

const META = {
  title: 'Ricardo Gómez',
  description: 'Ricardo Gómez',
  secciones: ['inicio', 'websamigas', 'conferencias',
  'paraleer', 'mislibros', 'premios', 'biografia',
  'encuentros', 'matematicas', 'contacto', 'elsahara']
}

function sections () {
  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (name) {
      if (!minimatch(name, '**/*.md')) return

      var data = files[name]
      data.section = name.split('/')[0]
    })
    done()
  }
}

/**
 * Create a metalsmith instance ready to build
 */
module.exports = function (src, dest) {
  return Metalsmith(__dirname)
  .source(src)
  .destination(dest)
  .metadata(META)
  .use(includes({ prefix: '!! incluye' }))
  .use(sections())
  .use(markdown())
  .use(directives(processors))
  .use(partial({ directory: './templates/partials', engine: 'handlebars' }))
  .use(layouts({ default: 'page.html', directory: 'templates', engine: 'handlebars' }))
  .use(permalinks())
  .use(concat({
    'stylesheets/portada.css': { 'base': './stylesheets', 'files': ['portada.css', 'sections.css'] },
    'stylesheets/all.css': { 'base': './stylesheets', 'files': ['reset.css', 'fonts.css', 'sections.css', 'page.css', 'article.css'] }
  }))
  .use(assets({ source: './assets', destination: '.' }))
  //  .use(redirects({ file: 'redirects.txt' }))
}
