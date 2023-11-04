class CommunityMembershipBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :keys, :tier, :initiated_at

    association :community, blueprint: CommunityBlueprint, view: :normal
    association :user, blueprint: UserBlueprint, view: :normal
  end
end
