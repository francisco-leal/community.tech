class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :event_type, null: false
      t.string :tx_hash, null: false
      t.string :chain_id, null: false
      t.jsonb :args

      t.timestamps
    end
  end
end
