class Requirement < ApplicationRecord
  belongs_to :category
  belongs_to :group

  default_scope { order(:sequence) }

  def courses
    group.courses
  end
end
