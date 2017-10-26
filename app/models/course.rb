class Course < ApplicationRecord
  def groups
    Group.where(":id = ANY(course_ids)", id: id)
  end

  def self.find_by_code(code)
    Course.find_by_sql([
      "SELECT DISTINCT c.* FROM courses c, unnest(codes) a " +
      "WHERE a = ?", code
    ]).first
  end
end
