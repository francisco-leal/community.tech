class User < ApplicationRecord
  validates :wallet, presence: true
  validates :wallet, uniqueness: true

  has_many :transactions
  has_many :community_memberships
  has_many :communities, through: :community_memberships

  after_create :generate_telegram_code

  private

  def generate_telegram_code
    update!(telegram_code: SecureRandom.hex(6))
  end
end
