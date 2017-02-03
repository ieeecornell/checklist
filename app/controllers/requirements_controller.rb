class RequirementsController < ApplicationController
  def index
    cat = Category.find(params[:category_id]) || not_found
    reqs = cat.requirements || not_found

    respond_to do |format|
      format.json { render json: reqs, include: :courses, status: :ok }
    end
  end

  def show
    req = Requirement.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: req, include: :courses, status: :ok }
    end
  end
end
