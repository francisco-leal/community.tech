class CommunitiesController < ApplicationController
  def index
    communities = Community.all

    if keyword
      communities = communities.where("name ILIKE :keyword OR description ILIKE :keyword",  keyword: "%#{keyword}%")
    end

    if name
      communities = communities.where(name: name)
    end

    render json: {communities: CommunityBlueprint.render_as_json(communities.includes(:owner), view: :normal) }, status: :ok
  end

  def create
    community = Community.create!(community_params.merge(owner: user!))

    render json: {community: CommunityBlueprint.render_as_json(community, view: :normal) }, status: :ok
  end

  private

  def keyword
    params["keyword"]
  end

  def name
    params["name"]
  end

  def community_params
    params.require(:community)
      .permit(
        :name,
        :description,
        :picture_url,
        :safe_address,
        :readable_fee_amount,
        :telegram_chat_id
      )
  end
end
