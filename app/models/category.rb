class Category < ApplicationRecord
  default_scope { order(:sequence) }

  has_many :requirements
end
