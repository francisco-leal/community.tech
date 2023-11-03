require 'telegram/bot'

class KickFromTelegram
  def initialize
    token = ENV["TELEGRAM_BOT_TOKEN"]
    @bot = Telegram::Bot::Client.new(token)
  end

  def call(user, membership)
    @bot.kickChatMember(chat_id: membership.chat_id, user_id: user.telegram_user_id)
  end
end
