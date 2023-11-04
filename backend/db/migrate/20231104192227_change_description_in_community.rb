class ChangeDescriptionInCommunity < ActiveRecord::Migration[7.1]
  def change
    change_column_null :communities, :description, true
  end
end
