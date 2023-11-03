class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :wallet
  end
end
