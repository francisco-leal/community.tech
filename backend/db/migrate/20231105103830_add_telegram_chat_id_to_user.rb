class AddTelegramChatIdToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :telegram_chat_id, :string
  end
end
