class CategoriesController < ApplicationController
  def index
    cats = Category.all

    respond_to do |format|
      format.json { render json: cats, include: :requirements, status: :ok }
    end
  end

  def create
    category = Category.create(category_params)

    respond_to do |format|
      format.json { render json: category, status: :ok }
    end
  end

  def show
    cat = Category.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: cat, include: :requirements, status: :ok }
    end
  end

  def update
    category = Category.find(params[:id])
    category.update(category_params)
    category.save
  end

  def destroy
    Category.find(params[:id]).destroy
  end

  private

  def category_params
    params.permit(:name, :sequence)
  end
end
