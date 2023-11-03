class Community < ApplicationRecord
  belongs_to :owner, class_name: "User"

  has_many :community_memberships
  has_many :users, through: :community_memberships

  validates :name, :description, :safe_address, presence: true
  validates :name, uniqueness: true

  def telegram_invite_link
    # TODO - TELEGRAM
  end
end
