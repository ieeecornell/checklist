(function() {
  var COURSES_PER_PAGE = 10;

  var CoursesView = Backbone.View.extend({
    tagName: "div",
    className: "admin-content",

    events: {
      "keyup .search input": "searchCourses",
      "click .prev-page": "prevPage",
      "click .next-page": "nextPage"
    },

    initialize: function() {
      // Start on page 0 of the courses list with no search term
      this.page = 0;
      this.searchTerm = "";

      // Create a collection of courses to display
      this.collection = new Courses;
      this.collection.on("add", this.addCourse, this);
      this.collection.on("remove", this.removeCourse, this);
    },

    render: function() {
      // Add table controls
      this.$el.append(
        "<div class='table-controls'>" +
          "<div class='search'>" +
            "<input type='text' " +
              "placeholder='Search for a course code or title'>" +
          "</div>" +
          "<div class='paging'>" +
            "<a href='#' class='disabled next-page'>Next &rarr;</a>" +
            "<a href='#' class='disabled prev-page'>&larr; Prev</a>" +
            "<a href='#' class='add-course'>Add Course</a>" +
          "</div>" +
        "</div>"
      );

      // Add a table to display courses
      this.$el.append(
        "<table>" +
          "<thead>" +
            "<tr>" +
              "<th>Codes</th>" +
              "<th>Title</th>" +
              "<th>Credits</th>" +
            "</tr>" +
          "</thead>" +
          "<tbody class='linked courses-list'>" +
          "</tbody>" +
        "</table>"
      );
      this.$coursesList = this.$(".courses-list");

      // Display the element
      this.$el.appendTo("body");

      // Load the first set of courses
      this.loadCourses();
    },

    loadCourses: function() {
      // Load the courses for the given page
      $.ajax({
        url: "/courses.json",
        data: {
          page: this.page,
          per_page: COURSES_PER_PAGE,
          q: this.searchTerm
        }
      }).done(_.bind(function(data) {
        // Display all of the courses
        this.collection.set(data);

        // Update the paging controls
        this.updatePagingControls(data.length);
      }, this)).fail(function() {
        alert("Error loading courses");
      });
    },

    searchCourses: function(e) {
      // Get the search term
      this.searchTerm = e.target.value.trim();

      // Go back to the first page
      this.page = 0;

      // Update the courses list
      this.loadCourses();
    },

    addCourse: function(course) {
      this.$coursesList.append(
        "<tr data-id='" + course.get("id") + "'>" +
          "<td>" + course.get("codes").join("/") + "</td>" +
          "<td>" + course.get("title") + "</td>" +
          "<td>" + course.get("credits") + "</td>" +
        "</tr>"
      );
    },

    removeCourse: function(course) {
      this.$coursesList.find("[data-id='" + course.get("id") + "']").remove();
    },

    /**
     * Loads the previous page of results.
     */
    prevPage: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Do nothing if this button is disabled
      if ($(e.target).is(".disabled")) return;

      this.page--;
      this.loadCourses();
    },

    /**
     * Loads the next page of results.
     */
    nextPage: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Do nothing if this button is disabled
      if ($(e.target).is(".disabled")) return;

      this.page++;
      this.loadCourses();
    },

    /**
     * Enables or disables the previous and next buttons, as appropriate.
     * Assumes that there are more courses to load if `numCourses` is equal to
     * the number of courses to load per page.
     */
    updatePagingControls: function(numCourses) {
      // Enable/disable the previous page button
      if (this.page > 0) {
        this.$(".prev-page").removeClass("disabled");
      }
      else {
        this.$(".prev-page").addClass("disabled");
      }

      // Enable/disable the next page button
      if (numCourses == COURSES_PER_PAGE) {
        this.$(".next-page").removeClass("disabled");
      }
      else {
        this.$(".next-page").addClass("disabled");
      }
    }
  });

  window.CoursesView = CoursesView;  
})();
