// PROCESSORS: the view directives (see plugins/directives)
module.exports = {
  // IMAGEN path posición: cen | izq | der texto: cosas
  imagen: function (dir, h) {
    var url = '/imagenes/' + dir.name
    var texto = dir.options['texto'] || ''
    var pos = dir.options['pos'] || dir.options['posicion'] || 'izq'

    return h('img', { 'src': url, 'alt': texto,
    'class': 'image-helper-position-' + pos})
  },

  // LIBRO imágen: ... página: ...
  libro: function (dir, h) {
    var title = dir.name
    var url = '/mislibros/' + dir.options['pagina']
    var thumb = '/imagenes/mislibros/' + dir.options['imagen']

    return h('a', { href: url }, [
      h('img', {'src': thumb, 'alt': title, 'class': 'book'})
    ])
  },

  salto: function (dir, h) {
    return h('div', {'class': 'clearfix'})
  }
}
