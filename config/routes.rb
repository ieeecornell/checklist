Rails.application.routes.draw do
  root to: 'users#show'

  namespace :admin do
    resources :courses
    resources :groups
    resources :categories do
      resources :requirements
    end
  end
end
