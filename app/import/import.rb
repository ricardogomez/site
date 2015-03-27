require 'word_wrap'
require 'fileutils'
require 'csv'
require 'yaml'
require 'reverse_markdown'
require_relative 'RedCloth-3.0.4/init'

require_relative 'pages'
require_relative 'images'

SECTIONS = [
  'inicio', 'websamigas', 'conferencias', 'paraleer',
  'mislibros', 'premios', 'biografia',
  'encuentros', 'matematicas', 'contacto', 'elsahara', 'otras',
  'mislibros/edelvives', 'mislibros/alfaguara', 'mislibros/adultos',
  'mislibros/sm', 'mislibros/sm-especial', 'mislibros/divulgativos',
  'mislibros/adaptaciones', 'mislibros/varios-y-colectivos',
  'mislibros/otros', 'mislibros/edelvives-ilustrado'
]

def mkdir(path)
  Dir.mkdir(path) unless File.exist?(path)
end
def prepare_output(dest)
  puts "Preparing: #{dest}"
  path = path(dest)
  mkdir(path)
  SECTIONS.each do |s|
    mkdir(File.join(path, s))
  end
  path
end

class Importer
  def initialize
    puts "Importing data..."
    @pages_out = prepare_output('../../publicar/paginas')
    @images_out = prepare_output('../../publicar/imagenes')
    @pagesRepo = Pages.new
    @imagesRepo = Images.new(@pagesRepo.pages)
    @replaces = {}
    @imagesRepo.all.each {|i| @replaces[i['source_path']] = i['dest_path']}
  end

  def images
    puts "Copying images..."
    @imagesRepo.copy_images(path('0000'), @images_out);
    return self
  end

  def pages
    puts "Building pages..."
    @pagesRepo.export(@pages_out, @replaces)
    return self
  end

  def redirects
    @pagesRepo.write_redirect_data(path('redirects.yml'))
    return self
  end
end

Importer.new #.images.pages.redirects
