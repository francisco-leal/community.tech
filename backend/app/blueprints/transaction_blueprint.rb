class TransactionBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :event_type, :args, :tx_hash, :chain_id

    association :user, blueprint: UserBlueprint, view: :normal
  end
end
