class Group < ApplicationRecord
  has_many :courses, through: :courses_groups
  has_many :courses_groups
  has_many :requirements

  default_scope { order(:name) }
end
