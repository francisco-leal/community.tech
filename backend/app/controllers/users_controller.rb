class UsersController < ApplicationController
  def show
    render json: {user: UserBlueprint.render_as_json(user!, view: :normal) }, status: :ok
  end

  def create
    user = User.create!(user_params)

    render json: {user: UserBlueprint.render_as_json(user, view: :normal) }, status: :ok
  end

  private

  def keyword
    params["keyword"]
  end

  def user_params
    params.require(:user)
      .permit(
        :wallet,
        :telegram_handle
      )
  end
end
