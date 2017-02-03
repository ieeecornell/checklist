# # ------------------------------------------------------------------------------
# # Get all of the courses from Cornell's website
# # ------------------------------------------------------------------------------

# # Drop all current courses
# Course.destroy_all

# url_base = 'https://classes.cornell.edu/browse/roster'
# semesters = ['FA14', 'SP15', 'FA15', 'SP16', 'FA16', 'SP17']

# # Get the classes for each semester
# semesters.each do |semester|
#   # Get all of the subject codes
#   puts "-----------------------------------------------"
#   puts "Fetching subject codes for semester #{semester}"
#   puts "-----------------------------------------------"
#   page = HTTParty.get("#{url_base}/#{semester}")
#   parsed_page = Nokogiri::HTML(page)

#   # Get all of the courses for each subject
#   parsed_page.css('.subject-group').each do |ul|
#     subject = ul.css('.browse-subjectcode').text

#     puts "-> Getting courses for #{subject}"
#     subject_page = HTTParty.get("#{url_base}/#{semester}/subject/#{subject}")
#     parsed_subject_page = Nokogiri::HTML(subject_page)

#     parsed_subject_page.css(".node[data-subject='#{subject}']").each do |node|
#       course_codes = [node.css('.title-subjectcode').text]
#       title = node.css('.title-coursedescr').text
#       credits = (node.css('.credits strong')[0].text || '').gsub(/[^0-9].$/, '')
#       course_codes.concat node.css(".enroll-info a[href^='/browse/roster/']")
#                               .map { |a| a.text }

#       next if Course.where("'#{course_codes.first}' = ANY(codes)").count > 0

#       Course.create(codes: course_codes, credits: credits, title: title)
#     end
#   end
# end

# # ------------------------------------------------------------------------------
# # Get all of the liberal studies
# # ------------------------------------------------------------------------------
# ls_url_base = 'https://www.engineering.cornell.edu/apps/liberalstudies'
# ls_categories = ['CA', 'HA', 'KCM', 'LA', 'SBA', 'CE']

# puts '------------------------'
# puts 'Fetching liberal studies'
# puts '------------------------'

# # Get all of the courses in each of the categories
# ls_categories.each do |cat|
#   puts "-> Fetching courses in category #{cat}"

#   page = HTTParty.get("#{ls_url_base}/#{cat}.cfm")
#   parsed_page = Nokogiri::HTML(page)

#   courses_count = 0
#   not_found_count = 0
#   parsed_page.css('#content table tr').each do |tr|
#     next if tr.css('td').blank?

#     subject_code = tr.css('td')[0].text
#     course_number = tr.css('td')[1].text

#     code = "#{subject_code} #{course_number}"
#     course = Course.where("'#{code}' = ANY(codes)").first

#     if course.blank?
#       not_found_count += 1
#     else
#       course.update_attribute(:metadata, {libstud: cat})
#     end

#     courses_count += 1
#   end
#   puts "Found #{courses_count - not_found_count}/#{courses_count} courses"
# end

# ------------------------------------------------------------------------------
# Add all of the groups
# ------------------------------------------------------------------------------
Group.destroy_all

# Add the groups that are explicitly defined in the JSON
group_file = File.read(File.join(Dir.pwd, 'db', 'seed_data', 'groups.json'))
group_json = JSON.parse(group_file)

puts '-------------'
puts 'Adding groups'
puts '-------------'
group_json.each do |group|
  puts "-> Adding #{group['name']}"
  db_group = Group.create(name: group['name'])

  group['courses'].each do |code|
    db_course = Course.where("'#{code}' = ANY(codes)").first
    if db_course.blank?
      puts "Could not find course #{code}"
    else
      db_group.courses << db_course
    end
  end
end

# Add a liberal studies group
puts '-> Adding Liberal Studies'
ls_group = Group.create(name: 'Liberal Studies')
ls_group.courses << Course.where("metadata ? 'libstud'")

# Add a FWS group
puts '-> Adding First-year Writing Seminar'
fws_group = Group.create(name: 'First-year Writing Seminar')
fws_group.courses << Course.where("title ILIKE 'FWS:%'")

# Add an ENGRI group
puts '-> Adding Introduction to Engineering'
engri_group = Group.create(name: 'Introduction to Engineering')
engri_group.courses << Course.find_by_sql("SELECT c.* " +
                                          "FROM courses c, unnest(codes) a " +
                                          "WHERE a LIKE 'ENGRI%'")

# ------------------------------------------------------------------------------
# Add all of the categories and requirements
# ------------------------------------------------------------------------------
Category.destroy_all
Requirement.destroy_all

cr_file = File.read(File.join(Dir.pwd, 'db', 'seed_data',
                              'categories_requirements.json'))
cr_json = JSON.parse(cr_file)

puts '----------------------------------'
puts 'Adding categories and requirements'
puts '----------------------------------'

cat_seq = 0
cr_json.each do |cat|
  # Create the category
  db_cat = Category.create(name: cat['name'], sequence: cat_seq)
  cat_seq += 1

  # Create all of the requirements
  req_seq = 0
  cat['requirements'].each do |req|
    # Get the group
    group = Group.where(name: req['group_name']).first

    puts "Group #{req['group_name']} not found" if group.blank?

    # Create the requirement and add it to the category
    db_cat.requirements << Requirement.create(
      display: req['name'],
      sequence: req_seq,
      group_id: group.blank? ? nil : group.id,
      description: req['description']
    )
    req_seq += 1
  end
end
