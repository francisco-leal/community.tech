require 'telegram/bot'

WEB3_ADDRESS_REGEX = /\A0x[a-fA-F0-9]{40}\z/
TELEGRAM_INVITE_REGEX = /https:\/\/t.me\/joinchat\/[A-Za-z0-9_-]+/

def valid_invite_link?(text)
  text.match?(TELEGRAM_INVITE_REGEX)
end

COMMUNITY_NAMES = ['talent_protocol', 'twitter', 'telegram', 'discord']
chat_invite_links = {
  'talent_protocol' => nil,
  'twitter' => nil,
  'telegram' => nil,
  'discord' => nil
}

namespace :bot do
  task start: :environment do
    puts "starting bot..."
    url = 't.me/collective_tech_bot'
    token = ENV['TELEGRAM_BOT_TOKEN']

    bot = Telegram::Bot::Client.new(token)

    puts "setting up signal handler..."
    # Signal trap to handle interrupt signal
    Signal.trap("INT") do
      puts "Shutting down bot..."
      exit
    end

    puts "listening..."
    bot.listen do |message|
      case message
      when Telegram::Bot::Types::CallbackQuery
        case message.data
        when 'talent_protocol', 'twitter', 'telegram', 'discord'
          # Get the selected community invite link
          selected_community = message.data
          selected_community_link = chat_invite_links[message.data]

          if selected_community_link
            # If we have the invite link, send it to the user
            bot.api.answer_callback_query(
              callback_query_id: message.id,
              text: "You've selected #{selected_community.capitalize}. Tap to join the community!",
              url: selected_community_link
            )
          else
            # If we don't have the invite link, ask the user to share it
            bot.api.answer_callback_query(
              callback_query_id: message.id,
              text: "You've selected #{selected_community.capitalize}. Please share the invite link with us."
            )

            # Prompt the user to send the invite link
            bot.api.send_message(
              chat_id: message.from.id,
              text: "We don't have the invite link for #{selected_community.capitalize} yet. Please send it to us if you have it!"
            )
          end
        end
      when Telegram::Bot::Types::Message
        if message.text == '/start'
          bot.api.send_message(chat_id: message.chat.id, text: "Hello, #{message.from.first_name}! Please share with me your wallet address, to validate for access")
        elsif message.text == '/stop'
          bot.api.send_message(chat_id: message.chat.id, text: "Bye, #{message.from.first_name}")
        elsif WEB3_ADDRESS_REGEX.match?(message.text)
          wallet_address = message.text.strip
          user_name = message.from.username || message.from.first_name

          # Log the username and wallet to the console
          puts "Username: #{user_name}, Wallet: #{wallet_address}"

          # Replace with the communities the user has access to
          kb = [[
            Telegram::Bot::Types::InlineKeyboardButton.new(text: 'Talent Protocol', callback_data: 'talent_protocol'),
            Telegram::Bot::Types::InlineKeyboardButton.new(text: 'Twitter', callback_data: 'twitter'),
            Telegram::Bot::Types::InlineKeyboardButton.new(text: 'Telegram', callback_data: 'telegram'),
            Telegram::Bot::Types::InlineKeyboardButton.new(text: 'Discord', callback_data: 'discord'),
          ]]
          markup = Telegram::Bot::Types::InlineKeyboardMarkup.new(inline_keyboard: kb)

          # Confirm receipt of the wallet address
          bot.api.send_message(
            chat_id: message.chat.id,
            text: "Thank you, we've confirmed the communities you have access to. Now, please choose the community you want to set up:",
            reply_markup: markup
          )
        elsif valid_invite_link?(message.text)
          # Attempt to extract the community name from the message
          community_name = COMMUNITY_NAMES.find { |name| message.text.include?(name) }
          
          if community_name && message.from.username == authorized_user
            # If a valid community name is found and the user is authorized, save the invite link
            chat_invite_links[community_name] = message.text.strip
            bot.api.send_message(
              chat_id: message.chat.id,
              text: "Thank you! The invite link for #{community_name.capitalize} has been updated."
            )
          else
            bot.api.send_message(
              chat_id: message.chat.id,
              text: "Please provide the community name along with the invite link or ensure you have permission to update links."
            )
          end
        else
          # Notify user of invalid wallet address
          bot.api.send_message(chat_id: message.chat.id, text: "The text you've sent is not valid")
        end
      end
    end
  end
end
