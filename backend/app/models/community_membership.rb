class CommunityMembership < ApplicationRecord
  belongs_to :community
  belongs_to :user

  validates :initiated_at, presence: true

  scope :active, -> { where("keys > 0") }

  def tier
    return "Gold" if keys >= 5
    return "Silver" if keys > 0
  end
end
