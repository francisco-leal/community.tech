# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_11_04_192227) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "communities", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.string "picture_url"
    t.string "safe_address", null: false
    t.bigint "owner_id", null: false
    t.decimal "readable_fee_amount"
    t.string "telegram_chat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_communities_on_owner_id"
  end

  create_table "community_memberships", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.bigint "user_id", null: false
    t.datetime "initiated_at", precision: nil, null: false
    t.datetime "ceased_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "keys", default: 0
    t.index ["community_id"], name: "index_community_memberships_on_community_id"
    t.index ["user_id"], name: "index_community_memberships_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "event_type", null: false
    t.string "tx_hash", null: false
    t.string "chain_id", null: false
    t.jsonb "args"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "wallet", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "telegram_handle"
    t.string "telegram_code"
    t.integer "telegram_user_id"
    t.index ["wallet"], name: "index_users_on_wallet", unique: true
  end

  add_foreign_key "communities", "users", column: "owner_id"
  add_foreign_key "community_memberships", "communities"
  add_foreign_key "community_memberships", "users"
  add_foreign_key "transactions", "users"
end
