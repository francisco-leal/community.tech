class Transaction < ApplicationRecord
  belongs_to :user

  validates :tx_hash, :chain_id, presence: true

  enum event_type: {
    community_created: "community_created",
    community_key_bought: "community_key_bought",
    community_key_sold: "community_key_sold"
  }
end
