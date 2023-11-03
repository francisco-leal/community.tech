class User < ApplicationRecord
  validates :wallet, presence: true
  validates :wallet, uniqueness: true

  has_many :transactions
  has_many :community_memberships
  has_many :communities, through: :community_memberships
end
