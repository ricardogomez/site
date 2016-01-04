var minimatch = require('minimatch')
var Metalsmith = require('metalsmith')

// plugins
var redirects = require('.plugins/redirects')
var includes = require('.plugins/includes')

const META = {
  title: 'Ricardo Gómez',
  description: 'Ricardo Gómez',
  secciones: ['inicio', 'websamigas', 'conferencias',
  'paraleer', 'mislibros', 'premios', 'biografia',
  'encuentros', 'matematicas', 'contacto', 'elsahara']
}

function addSection (files, metalsmith, done) {
  Object.keys(files).forEach(function (name) {
    if (!minimatch(name, '**/*.md')) return

    var data = files[name]
    data.section = name.split('/')[0]
  })
  done()
}

var metalsmith = Metalsmith(__dirname)
  .source('../publicar/paginas')
  .destination('build')
  .metadata(META)
  .use(addSection)
  .use(redirects({ file: 'redirects.txt' }))
  .use(includes({ prefix: '!! incluye' }))

metalsmith.build(function (err) {
  if (err) throw err
})
