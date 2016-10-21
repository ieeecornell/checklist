class CreateCourses < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'hstore'

    create_table :courses do |t|
      t.string :code, array: true
      t.string :prereqs, array: true
      t.string :coreqs, array: true
      t.hstore :metadata
    end

    add_index :courses, :code, using: :gin
  end
end
