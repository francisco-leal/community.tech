class MembershipsController < ApplicationController
  def index
    community_memberships = CommunityMembership.active.where(user: user!)

    render(
      json: {
        community_memberships: CommunityMembershipBlueprint.render_as_json(community_memberships.includes(:community), view: :normal)
      },
      status: :ok
    )
  end
end
