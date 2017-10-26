class Group < ApplicationRecord
  has_many :requirements

  default_scope { order(:name) }

  def courses
    Course.where("id IN (:course_ids)", course_ids: course_ids)
  end

  def add_courses(courses)
    courses.each do |course|
      add_course(course, false)
    end
    self.save
  end

  def add_course(course, should_save=true)
    course = course.id if course.respond_to?(:id)
    unless course_ids.include?(course)
      course_ids << course
      self.save if should_save
    end
  end

  def remove_courses(courses)
    courses.each do |course|
      remove_course(course, false)
    end
    self.save
  end

  def remove_course(course, should_save=true)
    course = course.id if course.respond_to?(:id)
    course_ids.delete(course)
    self.save if should_save
  end
end
