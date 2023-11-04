require 'telegram/bot'

namespace :bot do
  task start: :environment do
    puts "starting bot..."
    token = ENV["TELEGRAM_BOT_TOKEN"]

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
        if message.data
          membership = Membership.find_by(name: message.data)
          response = bot.api.createChatInviteLink(
            chat_id: membership.chat_id,
            member_limit: 1 # This makes the link single-use
          )

          bot.api.answer_callback_query(
            callback_query_id: message.id,
            text: "You're ready to join #{membership.name}. Tap to join the community!",
            url: response["result"]["invite_link"]
          )
        else
          bot.api.answer_callback_query(
            callback_query_id: message.id,
            text: "Something went wrong."
          )
        end
      when Telegram::Bot::Types::Message
        case message.text
        when '/start'
          bot.api.send_message(
            chat_id: message.chat.id,
            text: "Please share your unique code"
          )
        else
          # The user might have sent their unique code, attempt to find the user by code
          user = User.find_by(code: message.text)
    
          if user
            # User found, update the telegram_user_id
            user.update!(telegram_user_id: message.from.id)
  
            kb = [[]]
            Membership.where(user: user).map do |membership|
              kb[0] << Telegram::Bot::Types::InlineKeyboardButton.new(text: membership.community.name, callback_data: membership.community.name)
            end
            markup = Telegram::Bot::Types::InlineKeyboardMarkup.new(inline_keyboard: kb)
            bot.api.send_message(
              chat_id: message.chat.id,
              text: "Thank you, we've confirmed the communities you have access to. Now, please choose the community you want to set up:",
              reply_markup: markup
            )
          else
            # No user found with that code, send an error message
            bot.api.send_message(
              chat_id: message.chat.id,
              text: "Sorry, the code you entered is not recognized. Please check and try again."
            )
          end
        end
      else
        if message.my_chat_member
          # Get the previous and current status of the bot in the chat
          previous_status = message.my_chat_member.old_chat_member.status
          new_status = message.my_chat_member.new_chat_member.status
    
          # Check if the bot has become an administrator
          if previous_status != 'administrator' && new_status == 'administrator'
            chat_id = message.my_chat_member.chat.id
            chat_title = message.my_chat_member.chat.title
    
            community = Community.find_by(title: chat_title)
            community.update!(telegram_chat_id: chat_id)
    
            puts "Bot has become an admin in chat: #{chat_title} (#{chat_id})"
          end
        end
        bot.api.send_message(chat_id: message.chat.id, text: "The text you've sent is not valid")
      end
    end
  end
end
