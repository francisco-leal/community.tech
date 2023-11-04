class MembershipsController < ApplicationController
  def index
    community_memberships = CommunityMembership.active.where(user: user!)

    render(
      json: {
        memberships: CommunityMembershipBlueprint.render_as_json(community_memberships.includes(:community), view: :normal)
      },
      status: :ok
    )
  end

  def community_members
    community = Community.find_by!("lower(name) = ?", params[:community_name]&.downcase)

    community_memberships = CommunityMembership.active.where(community: community)

    render(
      json: {
        memberships: CommunityMembershipBlueprint.render_as_json(community_memberships.includes(:community), view: :normal)
      },
      status: :ok
    )
  end
end
