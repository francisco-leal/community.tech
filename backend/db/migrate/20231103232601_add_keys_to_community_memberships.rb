class AddKeysToCommunityMemberships < ActiveRecord::Migration[7.1]
  def change
    add_column :community_memberships, :keys, :integer, default: 0
  end
end
