class GroupsController < ApplicationController
  before_action :authenticate, except: [:index, :show]
  
  def index
    groups = Group.all

    respond_to do |format|
      format.json { render json: groups, status: :ok }
    end
  end

  def create
    group = Group.create(group_params)

    respond_to do |format|
      format.json { render json: group, status: :ok }
    end
  end

  def show
    group = Group.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: group, include: :courses, status: :ok }
    end
  end

  def update
    group = Group.find(params[:id])
    group.update(group_params)
    group.save
  end

  def destroy
    Group.find(params[:id]).destroy
  end

  private

  def group_params
    params.permit(:name)
  end
end
