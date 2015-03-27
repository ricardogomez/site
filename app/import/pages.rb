require_relative 'utils'
require_relative 'csv_repo'


module PreparePage
  MISSING = { 'amadis' => 'Adaptaciones',
              'lucanor' => 'Adaptaciones',
              'perro' => 'Edelvives',
              'caperucita' => 'Edelvives',
              'unchicodiferente' => 'Edelvives',
              'juegos' => 'Edelvives'}

  EDITORIALES = {
    "Editorial SM" => "sm",
    "Editorial SM Edición Especial" => "sm-especial",
    "Aunque no sean míos, pero como si lo fueran" => "otros",
    "Edelvives-Álbum ilustrado" => "edelvives-ilustrado"
  }

  def self.prepare(page)
    prepare_path(page)
    page['head'] = page['head'].gsub!(/\*/, '')
  end

  def self.prepare_path(page)
    if child?(page)
      page['path'] = "#{page["section"]}/#{page["name"]}"
      prepare_libro(page) if page['section'] == 'mislibros'
    else
      page['path'] = page["section"]
    end
  end

  def self.prepare_libro(page)
    page['extra'] = MISSING[page['name']] if blank?(page['extra'])
    subpath = page['extra']
    subpath = EDITORIALES[subpath] ? EDITORIALES[subpath] : parameterize(subpath)
    page['subpath'] = subpath
    page['path'] = "mislibros/#{subpath}/#{page['name']}"
    #puts "LIBROS: #{page['path']}"
  end

  def self.child?(page)
    !blank?(page["name"]) && page["name"] != page["section"]
  end
end

# id,name,title,section,head,content,end,extra,params,position,created_on,updated_on
DATA_SRC = 'data/pages.csv'

class Pages
  attr_reader :pages

  def initialize
    @pages = CSVRepo.load('page', path(DATA_SRC))
    pages.all.each {|page| PreparePage.prepare(page) }
  end

  def export(output, replaces)
    pages.all.each do |page|
      # puts "Preparando: #{page['path']}"

      meta = {
        titulo:       page['title'],
        subtitulo:    page['head'],
      }
      #page['content'] = page['head'] + "\n\n" + page['content']
      content = clean_markdown(replace_image_paths(page['content'], replaces))
      content = content.gsub /\/ver([^\)]*)/ do
        path = Regexp.last_match[1]
        parameterize(path)
      end

      path = clean_path("#{page['path']}.md")
      write(File.join(output, path), content, meta)
      #write(File.join(output, "#{page['path']}.yml"), YAML.dump(page))

    end
  end

  def write_redirect_data(file)
    ndx = {}
    pages.all.each {|p| ndx['/ver/' + p['path']] = clean_path(p['path']) }
    write(file, YAML.dump(ndx))
  end

  def dump(file)
    write(File.join(__dir__, 'pages.yml'), YAML.dump(pages.all))
  end

  private
  def clean_markdown(content)
    md = RedCloth.new(content)
    html = md.to_html.to_s.gsub(/[\n\t]+/, '')
    wrap_lines ReverseMarkdown.convert(html)
  end

  def replace_image_paths(content, replaces)
    content.gsub(/\/attachments\/0000\/[^!)]+/) do |path|
      match = path['attachments/0000/'.length + 1..-1]
      replace = replaces[match]
      if replace.nil?
        puts "ERROR: #{match} REPLACE NOT FOUND."
        "ERROR (imagen no encontrada): #{match}"
      else
        "/imagenes/#{replace}"
      end
    end
  end
end
