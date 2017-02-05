class AddAllowCrosslistingToRequirements < ActiveRecord::Migration[5.0]
  def change
    add_column :requirements, :allow_crosslisting, :boolean, default: false
  end
end
