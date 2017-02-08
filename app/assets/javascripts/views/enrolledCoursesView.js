(function() {
  var EnrolledCoursesView = Backbone.View.extend({
    el: "ul.enrolled-course-list",

    events: {
      "submit #add-semester-form": "formAddSemester"
    },

    initialize: function() {
      this.collection.on("add", this.addCourse, this);
      this.on("semester:add semester:remove", this.showHelpText, this);
      this.semesters = [];
    },

    addCourse: function(course) {
      // Find the semester that this course is in
      var semester = _.find(this.semesters, function(semester) {
        return semester.getSemester() == course.get("semester") &&
          semester.getYear() == course.get("year");
      });

      // If the semester does not exist, create it
      if (!semester) {
        semester = this.addSemester(course.get("semester"), course.get("year"));
      }

      // Add the course to the semester UI
      semester.addCourse(course);
    },

    addSemester: function(semester, year) {
      // Create a form for this semester
      var semesterForm = new SemesterView({
        collection: this.collection,
        semester: semester,
        year: year,
        parentView: this
      });

      // Insert the form in the correct place
      var $semesters = this.$el.find(".semester");
      var $newForm = semesterForm.render();
      var $beforeForm = this.$el.find(".add-semester");
      $semesters.each(_.bind(function (_i, oldForm) {
        var $oldForm = $(oldForm);

        if (this.semComesBefore($newForm, $oldForm)) {
          $beforeForm = $oldForm;
          return false;
        }
      }, this));
      $beforeForm.before($newForm);

      this.semesters.push(semesterForm);

      this.trigger("semester:add");

      return semesterForm;
    },

    formAddSemester: function(e) {
      // Don't actually submit the form
      e.preventDefault();

      // Get the selected semester and year
      var semester = this.$el.find("#semester").val();
      var year = this.parseYear(this.$el.find("#year").val());

      // Do nothing if the year entered was invalid
      if (year == -1) {
        alert("Please enter a valid year.");
        return;
      }

      // Do nothing if the semester exists
      var semExists = $(
        "li.semester" +
        "[data-semester='" + semester + "']" +
        "[data-year='" + year + "']"
      ).length > 0;
      if (semExists) {
        alert("This semester already exists.");
        return;
      }

      // Add the semester
      this.addSemester(semester, year);

      // Clear the year input
      $("#year").val("");
    },

    /**
     * Parses a string into an integer year. Accepts a 4 digit or a 2 digit
     * year, assuming the 21st century. Non-numeric characters are ignored.
     * @param year The string to parse
     * @return The parsed year, or -1 if no valid year was recognized
     */
    parseYear: function(year) {
      // Remove non-numeric characters
      year = year.replace(/[^0-9]/g, "");

      // Try to parse the year into an integer
      if (isFinite(year)) {
        // Parse the year into an integer
        year = parseInt(year);

        // If the year is between 0 and 100, add 2000 to get the year to the
        // 21st century
        if (year >= 0 && year < 100) year += 2000;

        return year >= 1865 ? year : -1;
      }
      else {
        return -1;
      }
    },

    /**
     * Returns true if the semester in form `$f1` comes before the semester in
     * form `$f2`.
     * @param $f1 A semester form element
     * @param $f2 A semester form element
     * @return True iff `$f1` comes before `$f2`
     */
    semComesBefore: function($f1, $f2) {
      var semester1 = $f1.attr("data-semester");
      var semester2 = $f2.attr("data-semester");
      var year1 = Number($f1.attr("data-year"));
      var year2 = Number($f2.attr("data-year"));

      var semesterCodes = {
        "W": 0,
        "S": 1,
        "Su": 2,
        "F": 3
      };

      return year1 < year2 ?
        true :
        year1 == year2 ?
          semesterCodes[semester1] < semesterCodes[semester2] :
          false;
    },

    render: function() {
      this.showHelpText();
    },

    /**
     * Shows help text when there are no enrolled courses or semesters.
     */
    showHelpText: function() {
      var $coursesContainer = $(".courses-container");

      if (this.$("li.semester").length > 0) {
        $coursesContainer.find(".help-text").remove();
      }
      else {
        $coursesContainer.append(
          "<div class='help-text'>" +
            "Add a semester to begin adding courses." +
          "</div>"
        );
      }
    }
  });

  window.EnrolledCoursesView = EnrolledCoursesView;  
})();
