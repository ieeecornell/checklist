class CreateCoursesGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :courses_groups do |t|
      t.integer :course_id
      t.integer :group_id
    end
  end
end
