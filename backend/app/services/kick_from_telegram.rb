require 'telegram/bot'
require 'dry-initializer'

class KickFromTelegram
  extend Dry::Initializer

  option :telegram_chat_id
  option :telegram_user_id

  def call
    telegram_bot.api.kickChatMember(
      chat_id: telegram_chat_id,
      user_id: telegram_user_id
    )
  end

  private

  def telegram_bot
    @telegram_bot ||= Telegram::Bot::Client.new(ENV["TELEGRAM_BOT_TOKEN"])
  end
end
