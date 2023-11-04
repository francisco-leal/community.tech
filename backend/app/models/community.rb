class Community < ApplicationRecord
  belongs_to :owner, class_name: "User"

  has_many :community_memberships
  has_many :users, through: :community_memberships

  validates :name, :safe_address, presence: true
  validates :name, uniqueness: true

  def telegram_invite_link
    token = ENV["TELEGRAM_BOT_TOKEN"]
    bot = Telegram::Bot::Client.new(token)

    response = bot.api.createChatInviteLink(
      chat_id: community.telegram_chat_id,
      member_limit: 1 # This makes the link single-use
    )

    response["result"]["invite_link"]
  end
end
