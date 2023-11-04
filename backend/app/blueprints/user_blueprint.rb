class UserBlueprint < Blueprinter::Base
  fields :id

  view :normal do
    fields :wallet, :telegram_code
  end
end
