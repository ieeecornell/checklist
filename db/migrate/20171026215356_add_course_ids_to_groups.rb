class AddCourseIdsToGroups < ActiveRecord::Migration[5.0]
  def change
    add_column :groups, :course_ids, :integer, array: true
    add_index :groups, :course_ids, using: 'gin'
  end
end
