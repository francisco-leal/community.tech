class CreateCommunityMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :community_memberships do |t|
      t.references :community, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.timestamp :initiated_at, null: false
      t.timestamp :ceased_at

      t.timestamps
    end
  end
end
