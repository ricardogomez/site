class CSVRepo
  attr_reader :name, :all, :keys, :byId

  def initialize(name, keys)
    @name = name
    @keys = keys
    @all = []
    @byId = {}
  end

  def insert(row)
    data = Hash[keys.zip(row)]
    all << data
    byId[data["id"]] = data
  end

  def self.load(name, file)
    repo = nil
    CSV.foreach(file) do |row|
      if repo.nil?
        repo = CSVRepo.new(name, row)
      else
        repo.insert(row)
      end
    end
    repo
  end
end
