# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170203032323) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "categories", force: :cascade do |t|
    t.string  "name"
    t.integer "sequence"
  end

  create_table "courses", force: :cascade do |t|
    t.string  "codes",    array: true
    t.string  "title"
    t.integer "credits"
    t.hstore  "metadata"
    t.index ["codes"], name: "index_courses_on_codes", using: :gin
  end

  create_table "courses_groups", force: :cascade do |t|
    t.integer "course_id"
    t.integer "group_id"
    t.index ["course_id"], name: "index_courses_groups_on_course_id", using: :btree
    t.index ["group_id"], name: "index_courses_groups_on_group_id", using: :btree
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
  end

  create_table "requirements", force: :cascade do |t|
    t.string  "display"
    t.integer "sequence"
    t.integer "group_id"
    t.text    "description"
    t.integer "category_id"
    t.index ["category_id"], name: "index_requirements_on_category_id", using: :btree
  end

end
