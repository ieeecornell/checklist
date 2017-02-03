class CategoriesController < ApplicationController
  def index
    cats = Category.all

    respond_to do |format|
      format.json { render json: cats, include: :requirements, status: :ok }
    end
  end

  def show
    cat = Category.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: cat, include: :requirements, status: :ok }
    end
  end
end
