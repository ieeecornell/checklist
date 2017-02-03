class CoursesController < ApplicationController
  def index
    courses = if !params[:libstud].blank?
                Course.where("metadata @> hstore('libstud', :value)",
                             value: params[:libstud])
              else
                Course.all
              end

    respond_to do |format|
      format.json { render json: courses, status: :ok }
    end
  end

  def show
    course = Course.find(params[:id]) || not_found

    respond_to do |format|
      format.json { render json: course, status: :ok }
    end
  end
end
