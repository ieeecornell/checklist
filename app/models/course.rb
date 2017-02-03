class Course < ApplicationRecord
  has_many :groups, through: :courses_groups
  has_many :courses_groups
end
