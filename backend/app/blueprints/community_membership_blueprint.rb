class CommunityMembershipBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :keys, :tier

    association :community, blueprint: CommunityBlueprint, view: :normal
  end
end
