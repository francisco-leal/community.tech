class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :wallet, :telegram_code

    field :communities_count do |user, _options|
      user.community_memberships.active.count
    end
  end
end
