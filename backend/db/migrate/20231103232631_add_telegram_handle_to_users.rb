class AddTelegramHandleToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :telegram_handle, :string
  end
end
