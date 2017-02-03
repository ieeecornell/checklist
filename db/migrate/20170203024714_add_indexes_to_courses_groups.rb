class AddIndexesToCoursesGroups < ActiveRecord::Migration[5.0]
  def change
    add_index :courses_groups, :course_id
    add_index :courses_groups, :group_id
  end
end
