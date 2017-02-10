class CoursesController < ApplicationController
  def index
    # Get the page and rows per page, if they were specified
    page = params[:page].blank? ? nil : params[:page].to_i
    per_page = params[:per_page].blank? ? 10 : params[:per_page].to_i
    unless params[:limit].blank?
      page = 0
      per_page = params[:limit].to_i
    end
    page_sql = page.blank? ?
               "" : " LIMIT #{per_page} OFFSET #{per_page * page}"

    courses = if !params[:code].blank?
                Course.find_by_sql [
                  "SELECT DISTINCT c.* FROM courses c, unnest(codes) a " +
                  "WHERE a ILIKE ?" + page_sql,
                  params[:code] + '%'
                ]
              elsif !params[:q].blank?
                Course.find_by_sql [
                  "SELECT DISTINCT c.* FROM courses c, unnest(codes) a " +
                  "WHERE a ILIKE ? OR title ILIKE ?" + page_sql,
                  "#{params[:q]}%", "%#{params[:q]}%"
                ]
              elsif !params[:libstud].blank?
                Course.where("metadata @> hstore('libstud', :value)",
                             value: params[:libstud])
              else
                Course.all
              end

    # Add paging if a page was specified
    if params[:code].blank? && params[:q].blank? && !page.blank?
      courses = courses.limit(per_page).offset(per_page * page)
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
