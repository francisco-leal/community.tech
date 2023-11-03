class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :wallet, null: false

      t.timestamps
    end

    add_index :users, :wallet, unique: true
  end
end
