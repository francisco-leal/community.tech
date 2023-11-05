class AddHandleToCommunities < ActiveRecord::Migration[7.1]
  def change
    add_column :communities, :handle, :string
  end
end
