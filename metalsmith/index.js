var minimatch = require('minimatch')
var Metalsmith = require('metalsmith')

// plugins
var markdown = require('metalsmith-markdown')
var redirects = require('.plugins/redirects')
var includes = require('.plugins/includes')
var directives = require('.plugins/directives')
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

var metalsmith = Metalsmith(__dirname)
  .source('../publicar/paginas')
  .destination('build')
  .metadata(META)
  .use(includes({ prefix: '!! incluye' }))
  .use(sections())
  .use(markdown)
  .use(redirects({ file: 'redirects.txt' }))
  .use(directives(processors))
  .use(concat({
    'stylesheets/portada.css': { 'base': './stylesheets', 'files': ['portada.css', 'sections.css'] },
    'stylesheets/all.css': { 'base': './stylesheets', 'files': ['reset.css', 'fonts.css', 'sections.css', 'page.css', 'article.css'] }
  }))

metalsmith.build(function (err) {
  if (err) throw err
})
