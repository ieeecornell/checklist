class Requirement < ApplicationRecord
  belongs_to :category
  belongs_to :group

  def courses
    group.courses
  end
end
