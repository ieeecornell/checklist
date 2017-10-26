class Course < ApplicationRecord
  has_many :groups, through: :courses_groups
  has_many :courses_groups

  def self.find_by_code(code)
    Course.find_by_sql([
      "SELECT DISTINCT c.* FROM courses c, unnest(codes) a " +
      "WHERE a = ?", code
    ]).first
  end
end
