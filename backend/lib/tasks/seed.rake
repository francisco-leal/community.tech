require 'telegram/bot'

namespace :db do
  task seed: :environment do
    chain_id = 1115
    # Created denites community
    create_community_tx = "0xac8efd6cfabb82647b19d845b2afa865076c5b1146216d57a9287a5c5e1debaa"

    wallet = "0x11e92E85dcEE8af4959c3415769c2F44695B9795".downcase
    community_params = {
      name: "denites",
      description: "Denites are decentralized events to showcase local web3 projects and startups in the most entertaining way possible. 📚 🪩",
      picture_url: "https://twitter.com/DenitesDAO/photo",
      safe_address:  wallet,
      readable_fee_amount: 5
    }
    user = User.find_or_create_by!(wallet: wallet)
    community = Community.create!(community_params.merge(owner: user))

    buy_txs = %w[
      0x34918d1562102a509bc59a0f09ac11800ae9286220799e502c24546e5164f559
      0x4151f4094cd42da72ed06e018d9daf6e2a0a9dc266d2b4c4473366f51c2fcd9c
      0xe941af641a69d1b7743b7aa79b5c65879bbddbf8f4276c8556ed5fde014a02dc
      0x6da4837ec21b6b663b2bb17c4a4a8a745d17c78315af8f45bcb9b1ca7649933f
      0x4651843e2eb90f0f47d6c3085f8bb01753e05e18c92cbad10dd3b7fb357412e1
      0x6a2a9e24b011e1c253bceafe9dd7f7d8604b6ce5775ce9870aa65062914bc39c
      0xa7f8e2dd1ba6fb57a4a729124b165dc2a4b9bedff758a8335612a25d25536bbf
      0x935af329dc81fb135ac187793e95db61269882e562a0ac1d7393f61699933edc
      0x879664863eeae8fd96b862d8b6cf8c999673d72a73a96b32b4d45e6a98435513
      0x112814ab0c3858bc8726b3c1a24cdb941ef867582ac4dbee9b2c90e561e8df27
    ]

    CreateTransaction.new(
      tx_hash: create_community_tx,
      chain_id:
    ).call

    buy_txs.each do |tx_hash|
      CreateTransaction.new(
        tx_hash:,
        chain_id:
      ).call
    end
  end
end
