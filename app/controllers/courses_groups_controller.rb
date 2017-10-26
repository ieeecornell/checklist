class CoursesGroupsController < ApplicationController
  def update
    CoursesGroup.transaction do
      group = Group.find(params[:group_id])

      add_codes = (params[:add_codes] || "").split(/\s*\n\s*/)
      add_codes.each do |code|
        next if code.blank?

        course = Course.find_by_code(code.upcase)

        unless course.blank?
          group.add_course(course)
        end
      end

      remove_codes = (params[:remove_codes] || "").split(/\s*\n\s*/)
      remove_codes.each do |code|
        next if code.blank?

        course = Course.find_by_code(code.upcase)

        unless course.blank?
          group.remove_course(course)
        end
      end
    end

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end
end
