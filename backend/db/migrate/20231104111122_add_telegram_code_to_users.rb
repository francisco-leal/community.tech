class AddTelegramCodeToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :telegram_code, :string
    add_column :users, :telegram_user_id, :integer
  end
end
