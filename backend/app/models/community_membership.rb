class CommunityMembership < ApplicationRecord
  belongs_to :community
  belongs_to :user

  validates :initiated_at, presence: true
end
