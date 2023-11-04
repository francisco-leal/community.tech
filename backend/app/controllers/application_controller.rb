class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def user!
    User.find_by!(wallet: wallet&.downcase)
  end

  def user
    @user ||= User.find_by(wallet: wallet&.downcase)
  end

  def wallet
    @wallet ||= params[:wallet] || params[:user_wallet]
  end

  def not_found
    render json: {error: "Resource not found."}, status: :not_found
  end
end
