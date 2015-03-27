def wrap_lines(s, width=78)
  #s.gsub(/(.{1,#{width}})(\s+|\Z)/, "\\1\n")
  s.wrap(width)
end

def blank?(string)
  string.nil? || string.empty?
end

def path(path)
  File.join(__dir__, path)
end

def write(file, content, meta = nil)
  File.open(file, 'w') do |file|
    if meta
      file.write("---\n")
      meta.each do |key, value|
        val = value ? value.gsub(/[\n]+/, '') : ''
        val.gsub!(/"/, '\"')
        file.write("#{key}: \"#{val}\"\n")
      end
      file.write("---\n")
    end
    file.write(content)
  end
end


TILDES = {'a' => 'á', 'e' => 'é', 'i' => 'í', 'o' => 'ó', 'u' => 'ú'}
def parameterize(string)
  string = string.downcase.gsub(' ','-').gsub('_', '-')
  TILDES.each {|k, v| string.gsub!(v, k) }
  string
end

def clean_path(string)
  parameterize(string)
end
