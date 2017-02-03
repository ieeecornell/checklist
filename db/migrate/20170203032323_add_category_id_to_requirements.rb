class AddCategoryIdToRequirements < ActiveRecord::Migration[5.0]
  def change
    add_column :requirements, :category_id, :integer
    add_index :requirements, :category_id
  end
end
