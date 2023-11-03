class CreateCommunities < ActiveRecord::Migration[7.1]
  def change
    create_table :communities do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.string :picture_url
      t.string :safe_address, null: false
      t.references :owner, null: false, index: true
      t.decimal :readable_fee_amount
      t.string :telegram_chat_id

      t.timestamps
    end
    add_foreign_key :communities, :users, column: :owner_id
  end
end
