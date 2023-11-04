class CommunityBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :name, :description, :picture_url, :safe_address, :readable_fee_amount, :telegram_chat_id

    field :members_count do |community, _options|
      community.community_memberships.active.count
    end

    association :owner, blueprint: UserBlueprint, view: :normal
  end
end
