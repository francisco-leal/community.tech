require 'dry-initializer'

class CreateTransaction
  extend Dry::Initializer

  option :tx_hash
  option :chain_id

  EVENT_MAP = {
    "CommunityCreated" => "community_created",
    "CommunityKeyBought" => "community_key_bought",
    "CommunityKeySold" => "community_key_sold"
  }

  def call
    existing_tx = Transaction.find_by(tx_hash:, chain_id:)
    raise "Tx: #{tx_hash} already imported" if existing_tx

    ActiveRecord::Base.transaction do
      events.map do |event|
        decoded_event = event[1]

        transaction = Transaction.create!(
          tx_hash:,
          chain_id:,
          user:,
          args: args(decoded_event),
          event_type: event_type(decoded_event)
        )

        upsert_community_membership(transaction) if transaction.community_key_bought? || transaction.community_key_sold?

        transaction
      end
    end
  end

  private

  def user
    User.find_or_create_by!(
      wallet: transaction_from
    )
  end

  def transaction_from
    transaction_receipt["result"]["from"]
  end

  def event_type(decoded_event)
    EVENT_MAP[decoded_event.name]
  end

  def args(decoded_event)
    decoded_event.kwargs
  end

  def upsert_community_membership(transaction)
    community = Community.find_by(name: transaction.args["_community_name"])
    raise "Unable to find community!" unless community

    community_membership = CommunityMembership.find_by(
      community: community,
      user: user
    )

    if transaction.community_key_bought?
      community_membership ||= CommunityMembership.create!(
        community: community,
        user: user,
        initiated_at: Time.current
      )

      community_membership.update!(keys: community_membership.keys += transaction.args["_amount_of_keys"].to_i)
    elsif transaction.community_key_sold?
      raise "Community Membership needs to exist if key was sold" unless community_membership

      community_membership.update!(keys: community_membership.keys -= transaction.args["_amount_of_keys"].to_i)
    end
  end

  def events
    Eth::Abi::Event.decode_logs(events_interface, transaction_receipt["result"]["logs"])
  end

  def events_interface
    @events_interface ||= contract_abi["abi"].select { |i| i["type"] == "event" }
  end

  def transaction_receipt
    @transaction_receipt ||= begin
      receipt = provider.eth_get_transaction_receipt(tx_hash)

      raise "Transaction #{tx_hash} not found" unless receipt

      receipt
    end
  end

  def community_keys_contract
    Eth::Contract.from_abi(
      name: "CommunityKeys",
      address: ENV["COMMUNITY_KEYS_CONTRACT_ADDRESS"],
      abi: contract_abi["abi"]
    )
  end

  def contract_abi
    @ontract_abi ||= JSON.parse(File.read("lib/abi/CommunityKeys.json"))
  end

  def provider
    @provider ||= Eth::Client.create rpc_url
  end

  def rpc_url
    ENV["RPC_URL"]
  end
end
