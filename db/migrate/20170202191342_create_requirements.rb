class CreateRequirements < ActiveRecord::Migration[5.0]
  def change
    create_table :requirements do |t|
      t.string :display
      t.integer :sequence
      t.integer :group_id
      t.text :description
    end
  end
end
