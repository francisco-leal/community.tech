Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  resources :transactions, only: [:create]

  resources :users, param: :wallet, only: [:show, :create] do
    resources :transactions, only: [:index]
    resources :memberships, only: [:index]
    resources :communities, only: [:create]
  end

  resources :communities, param: :name, only: [:index] do
    get "memberships" => "memberships#community_members"
  end
end
