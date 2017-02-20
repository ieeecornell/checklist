Rails.application.routes.draw do
  root to: 'users#show'

  resources :courses, except: [:new]
  resources :groups, only: [:index, :show]
  resources :categories, only: [:index, :show] do
    resources :requirements, except: [:new]
  end

  get '/admin', to: 'admin#show'
end
