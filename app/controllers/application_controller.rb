class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  private
  def authenticate
    if Rails.env.development? || Rails.env.test?
      authenticate_or_request_with_http_basic 'Login' do |u, p|
        u == "ece_admin" && p == "password"
      end
    end
  end

  def not_found
    raise ActionController::RoutingError, 'Not Found'
  end
end
