class AddDefaultValueToGroupsCourseIds < ActiveRecord::Migration[5.0]
  def change
    change_column :groups, :course_ids, :integer, array: true, default: []
  end
end
