class AddUniqueIndexToCoursesGroups < ActiveRecord::Migration[5.0]
  def change
    remove_index :courses_groups, :course_id
    remove_index :courses_groups, :group_id
    add_index :courses_groups, [:course_id, :group_id], unique: true
  end
end
