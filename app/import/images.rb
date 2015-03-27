require_relative 'csv_repo'

DATA = 'data/att.csv'

# id,content_type,filename,size,tags,description,page_id,parent_id,thumbnail,width,height,db_file_id
class Images
  attr_reader :images, :pages

  def initialize(pages)
    @pages = pages
    @images = CSVRepo.load('image', path(DATA))
    puts "#{@images.all.size} images loaded."
    process_images
  end

  def all
    @images.all
  end

  def dest_page_path(page)
      if page && page['section']
        path = page['section']
        path += '/' + page['subpath'] if page['subpath']
        return path
      else
        return 'otras'
      end
    end

  def process_images
    dest = []

    images.all.each do |image|
      root_id = !blank?(image['parent_id']) ? image['parent_id'] : image['id']
      image['source_path'] = image_path(root_id) + "/" + image['filename']
      root_image = images.byId[root_id]
      image['root_page_id'] = root_image['page_id']
      page = pages.byId[image['root_page_id']]

      image['page_path'] = dest_page_path(page)
      image['dest_path'] = image['page_path'] + "/" + parameterize(image['filename'])
      if dest.include?(image['dest_path'])
        image['dest_path'] = image['page_path'] +
          "/" + root_id + parameterize(image['filename'])
      end
      dest << image['dest_path']

      if image['tags'] == 'imágen_principal' && page
        image['page_title'] = page['title']
        page['main_image'] = image['dest_path']
        helper = "{{ imágen " + image['dest_path'] + " posición: izq }}"
        page['content'] = helper + page['content']
      end
    end
  end


  def copy_images(src, dest)
    copied = 0
    errors = 0
    images.all.each do |image|
      img_src = File.join(src, image['source_path'])
      img_dest = File.join(dest, image['dest_path'])

      if File.exist?(img_src)
        FileUtils.cp(img_src, img_dest)
        copied += 1
      else
          puts "ERROR image not found: #{img_src} // #{img_dest}"
          errors +=1
      end
    end
    puts "copied #{copied}, errors #{errors}"
  end

  def build_index(file)
    cols = ['id', 'source_path', 'dest_path', 'page_title']
    output = images.all.map do |image|
      row = cols.map {|c| "#{c[0..2]}:#{image[c]}"}
      row.map {|i| "| #{i}"}.join(' ')
    end.join("\n")
    write(file, "# Imágenes\n\n#{output}")
  end

  def image_path(id)
    "0" * (4 - id.length) + id
  end
end
