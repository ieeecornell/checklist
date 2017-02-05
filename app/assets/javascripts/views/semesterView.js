(function() {
  var SemesterView = Backbone.View.extend({
    tagName: "li",
    className: "semester",

    events: {
      "click .add-course span.plus": "addCourse",
      "keyup .add-course input": "autocomplete",
      "click a.remove": "removeCourse",
      "click a.remove-semester": "removeSemester"
    },

    initialize: function(opts) {
      this.semester = opts.semester;
      this.year = opts.year;
    },

    render: function() {
      // Set the proper attributes on the semester display
      this.$el.attr("data-semester", this.semester);
      this.$el.attr("data-year", this.year);
      
      // Generate the datalist ID
      var dlId = this.semester + "-" + this.year + "-dl";

      // Construct the view elements
      this.$el.append(
        "<h2>" +
          this.getSemesterDisplay(this.semester) + " " + this.year +
          "<a href='#' class='remove-semester' title='Remove'>&times;</a>" +
        "</h2>" +
        "<ul>" +
          "<li class='add-course editing'>" +
            "<span class='label'>" +
              "<input type='text' placeholder='Add Course...' list='" +
                dlId + "'>" +
              "<datalist id='" + dlId + "' />" +
            "</span>" +
            "<span class='plus'>+</span>" +
          "</li>" +
        "</ul>"
      );

      // Save the add button and the datalist
      this.$addButton = this.$(".add-course");
      this.$datalist = this.$("#" + dlId);
      
      return this.$el;
    },

    /**
     * Gets the human-readable semester display value from the semester code.
     * @param semester The code
     */
    getSemesterDisplay: function(semester) {
      this.semesterMap || (this.semesterMap = {
        "W": "Winter",
        "S": "Spring",
        "Su": "Summer",
        "F": "Fall"
      });
      return this.semesterMap[semester];
    },

    autocomplete: function(e) {
      // Add the course if enter is pressed
      if (e.which == 13) {
        e.preventDefault();
        this.addCourse();
        return;
      }

      // Get the course code to search for
      var searchVal = this.$el.find("input").val();

      // Do nothing if the value has not changed
      if (searchVal == this.oldSearchVal) {
        e.preventDefault();
        return;
      }

      // Save this value to compare after the next keystroke
      this.oldSearchVal = searchVal;

      // Search for that course
      $.ajax({
        url: "/courses.json",
        data: {limit: 10, code: searchVal.toUpperCase()}
      }).done(_.bind(function(data) {
        // Clear all of the autocomplete results
        this.$datalist.empty();

        // Create a regular expression to find the specific code that matched
        var qRegex = new RegExp("^" + searchVal.toUpperCase() + ".*");

        _.each(data, function(result) {
          var code = _.find(result.codes, function(code) {
            return qRegex.test(code);
          });

          this.$datalist.append(
            "<option>" + code + "</option>"
          );
        }, this);
      }, this));
    },

    addCourse: function() {
      // Get the course code
      var $addButton = this.$el.find(".add-course");
      var $input = $addButton.find("input");
      var code = $input.val().toUpperCase().trim();

      // Do nothing if the course code is blank
      if (!code.trim()) return;

      // Do nothing if this course already exists
      if (this.collection.findWhere({code: code})) {
        alert("This course has already been added.");
        return;
      }

      // Add a list element with this course
      $addButton.before(
        "<li>" +
          "<h3>" + code + "</h3>" +
          "<a class='remove' href='#' title='Remove'>&times;</a>" +
        "</li>"
      );

      // Clear the add button
      $input.val("");

      // Empty the datalist
      this.$datalist.empty();

      // Add the course to the list of courses
      var course = new Course;
      course.on("change", _.bind(function() {
        this.collection.add(course);
      }, this));
      course.fetchByCode(code);
    },

    removeCourse: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Get the code
      var $course = $(e.target).closest("li");
      var code = $course.find("h3").html();

      // Remove the course from the DOM
      $course.fadeOut(250, function() { $course.remove() });

      // Remove the course from the collection to trigger a reevaluation of the
      // requirements
      this.collection.remove(this.collection.findByCode(code));
    },

    removeSemester: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Clear all of the courses that are in this semester
      this.$("li:not(.add-course)").each(_.bind(function(_i, li) {
        var code = $(li).find("h3").html();
        this.collection.remove(this.collection.findByCode(code));
      }, this));

      // Remove this element
      this.$el.remove();
    }
  });

  window.SemesterView = SemesterView;  
})();
