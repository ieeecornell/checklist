(function() {
  var COURSES_PER_PAGE = 16;

  var RequirementView = Backbone.View.extend({
    tagName: "li",

    events: {
      "click span.help": "toggleHelp",
      "click .prev-info-page": "prevInfoPage",
      "click .next-info-page": "nextInfoPage"
    },

    initialize: function() {
      this.model.on("fill", this.fillReq, this);
      this.model.on("unfill", this.unfillReq, this);
    },

    render: function() {
      return this.$el
        .append(
          "<h3>" + this.model.get("display") + "</h3>" +
          "<span class='course incomplete'><em>Incomplete</em></span>" +
          "<span class='help'>?</span>"
        );
    },

    fillReq: function(course) {
      this.$("span.course").removeClass("incomplete").addClass("complete")
        .html(course.get("code"));

      // Add the liberal studies group that this fills, if necessary
      var metadata = course.get("metadata");
      if (metadata && metadata.libstud) {
        this.$el.addClass("libstud");
        this.$("span.libstud-cat").remove();
        this.$("span.course").after(
          "<span class='libstud-cat'>" + metadata.libstud + "</span>"
        );
      }
    },

    unfillReq: function() {
      this.$("span.course").removeClass("complete").addClass("incomplete")
        .html("<em>Incomplete</em>");
      this.$el.removeClass("libstud");
      this.$("span.libstud-cat").remove();
    },

    toggleHelp: function() {
      var $info = this.$(".info");

      // Check if the info needs to be shown or hidden
      if ($info.length > 0) {
        // Hide the info
        $info.slideUp(250, function() { $info.remove(); });
      }
      else {
        // Create an info element to add
        var $info = $("<div class='info' />");
        
        // Add the group's description, if one was defined
        if (this.model.get("description")) {
          $info.append("<p>" + this.model.get("description") + "</p>");
        }

        // Add a list of courses that fill this requirement
        $info.append(
          "<h4>Courses that fill this requirement</h4>" +
          "<ul>" +
            "<li>Loading&hellip;</li>" +
          "</ul>"
        );

        // Display the info element
        $info.hide();
        this.$el.append($info);
        $info.slideDown(250);

        // Fill the list with courses, fetching from the server first if
        // necessary
        if (this.model.get("courses")) {
          this.fillInfoList();
        }
        else {
          this.infoListPage = 0;
          var fetchCourses = _.bind(function() {
            this.fillInfoList();
            this.model.off("change", fetchCourses);
          }, this);
          this.model.on("change", fetchCourses);
          this.model.fetch();
        }
      }
    },

    fillInfoList: function() {
      if (this.model.get("courses").length == 0) {
        this.$(".info").find("ul, h4").remove();
        return;
      }

      // Get the lower and upper bounds of the indices of the courses to display
      var lower = this.infoListPage * COURSES_PER_PAGE;
      var upper = lower + COURSES_PER_PAGE > this.model.get("courses").length ?
        this.model.get("courses").length : lower + COURSES_PER_PAGE;

      // Append each of the info elements
      var $ul = this.$(".info ul").empty();

      for (var i = lower; i < upper; i++) {
        $ul.append(
          "<li>" + this.model.get("courses")[i].codes.join("/") + "</li>"
        );
      }

      // Calculate the total number of pages needed
      var numPages =
        Math.ceil(this.model.get("courses").length / COURSES_PER_PAGE);
      
      // Add a previous and next buttons, if necessary
      if (numPages > 1) {
        // Add an empty <li> before these buttons if there were an odd number of
        // courses
        if ((upper - lower) % 2 != 0) {
          $ul.append("<li />");
        }

        // Add the previous button
        if (this.infoListPage == 0) {
          $ul.append("<li />");
        }
        else {
          $ul.append(
            "<li><a href='#' class='prev-info-page'>&larr; Prev</a></li>"
          );
        }

        // Add the next button
        if (this.infoListPage == numPages - 1) {
          $ul.append("<li />");
        }
        else {
          $ul.append(
            "<li><a href='#' class='next-info-page'>Next &rarr;</a></li>"
          );
        }
      }      
    },

    prevInfoPage: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Show the previous page
      this.infoListPage--;
      this.fillInfoList();
    },

    nextInfoPage: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Show the next page
      this.infoListPage++;
      this.fillInfoList();
    }
  });

  window.RequirementView = RequirementView;
})();
