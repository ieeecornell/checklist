class GroupsController < ApplicationController
  def index
    groups = Group.all

    respond_to do |format|
      format.json { render json: groups, status: :ok }
    end
  end

  def show
    group = Group.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: group, include: :courses, status: :ok }
    end
  end
end