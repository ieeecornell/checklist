class RemoveCoursesGroups < ActiveRecord::Migration[5.0]
  def change
    drop_table :courses_groups
  end
end
