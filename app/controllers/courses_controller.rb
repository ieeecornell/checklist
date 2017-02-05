class CoursesController < ApplicationController
  def index
    courses = if !params[:code].blank?
                limit_sql = params[:limit].blank? ? ""
                                                  : " LIMIT #{params[:limit]}"
                Course.find_by_sql ["SELECT c.* " +
                                    "FROM courses c, unnest(codes) a " +
                                    "WHERE a LIKE ?" + limit_sql,
                                    params[:code] + '%']
              elsif !params[:libstud].blank?
                Course.where("metadata @> hstore('libstud', :value)",
                             value: params[:libstud])
              else
                Course.all
              end

    # Add a limit if one was specified
    if params[:code].blank? && !params[:limit].blank?
      courses = courses.limit(params[:limit])
    end

    respond_to do |format|
      format.json { render json: courses, status: :ok }
    end
  end

  def show
    course = begin
               Course.find(params[:id])
             rescue
               Course.where("? = ANY(codes)", params[:id]).first
             end

    respond_to do |format|
      format.json do
        if course.blank?
          render nothing: true, status: :not_found
        else
          render json: course, include: :groups, status: :ok
        end
      end
    end
  end
end
