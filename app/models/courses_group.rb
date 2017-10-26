class CoursesGroup < ApplicationRecord
  belongs_to :course
  belongs_to :group

  validates :course_id, uniqueness: { scope: :group_id }
end
