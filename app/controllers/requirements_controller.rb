class RequirementsController < ApplicationController
  def index
    cat = Category.find(params[:category_id]) || not_found
    reqs = cat.requirements || not_found

    respond_to do |format|
      format.json { render json: reqs, include: :courses, status: :ok }
    end
  end

  def create
    requirement = Requirement.create(requirement_params)

    respond_to do |format|
      format.json { render json: requirement, status: :ok }
    end
  end

  def show
    req = Requirement.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: req, include: :courses, status: :ok }
    end
  end

  def update
    requirement = Requirement.find(params[:id])
    requirement.update(requirement_params)
    requirement.save
  end

  def destroy
    Requirement.find(params[:id]).destroy
  end

  private

  def requirement_params
    params.permit(
      :display, :category_id, :description, :group_id, :allow_crosslisting,
      :sequence
    )
  end
end
