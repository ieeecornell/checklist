Rails.application.routes.draw do
  root to: 'users#show'

  resources :courses, only: [:index, :show]
  resources :groups, only: [:index, :show]
  resources :categories, only: [:index, :show] do
    resources :requirements, only: [:index, :show]
  end
end
