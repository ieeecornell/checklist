class CreateCourses < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'hstore'

    create_table :courses do |t|
      t.string :codes, array: true
      t.string :title
      t.integer :credits
      t.hstore :metadata
    end

    add_index :courses, :codes, using: :gin
  end
end
