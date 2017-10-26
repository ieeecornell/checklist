class CoursesGroupsController < ApplicationController
  def update
    CoursesGroup.transaction do
      group = Group.find(params[:group_id])

      add_codes = (params[:add_codes] || "").split(/\s*\n\s*/)
      add_codes.each do |code|
        next if code.blank?

        course = Course.find_by_code(code.upcase)

        unless course.blank?
          CoursesGroup.create(group_id: group.id, course_id: course.id)
        end
      end

      remove_codes = (params[:remove_codes] || "").split(/\s*\n\s*/)
      remove_codes.each do |code|
        next if code.blank?

        course = Course.find_by_code(code.upcase)

        unless course.blank?
          CoursesGroup.where(group_id: group.id, course_id: course.id).destroy_all
        end
      end
    end

    respond_to do |format|
      format.json { render nothing: true, status: :ok }
    end
  end
end
