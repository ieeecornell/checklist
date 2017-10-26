class UsersController < ApplicationController
  before_action :authenticate, except: [:index, :show]
  
	def show
    
  end
end
