(function() {
  var CategoriesView = Backbone.View.extend({
    el: "ul.checklist",

    /**
     * Renders the categories.
     */
    render: function() {
      this.collection.on("add", this.addCategory, this);
      this.collection.fetch();
    },

    /**
     * Displays the category in the UI and parses the requirements into a
     * collection.
     * @param cat The category that was added
     */
    addCategory: function(cat) {
      // var reqs = new Requirements(cat.get("requirements"));
      // cat.set("requirements", reqs);

      cat.get("requirements").each(function(req) {
        req.set("category", cat);
      });

      this.displayCategory(cat);
    },

    /**
     * Displays a single category in the proper place.
     * @param cat The category to display
     */
    displayCategory: function(cat) {
      var catView = new CategoryView({model: cat});
      this.$el.append(catView.render());
    },

    /**
     * Sets the enrolled courses that the categories are fulfilled by.
     * @param ecs The enrolled courses
     */
    setEnrolledCourses: function(ecs) {
      this.ecs = ecs;
      this.ecs.on("update", _.bind(this.fillRequirements, this));
    },

    /**
     * Fills all of the requirements with the available enrolled courses.
     */
    fillRequirements: function() {
      // Unmark any course from filling a requirement
      this.ecs.each(function(ec) {
        ec.unsetFills();
      });

      // Try to fill any requirements that can be filled
      this.collection.each(_.bind(function(cat) {
        cat.get("requirements").each(_.bind(function(req) {
          // Assume the requirement has not been filled unless a suitable course
          // is found
          req.unsetFilled();

          this.ecs.each(function(ec) {
            // Don't do anything if this course is being used to fill another
            // requirement, and this requirement does not allow crosslisting
            if (ec.isFilling() && !req.get("allow_crosslisting")) return;

            // Don't do anything if this requirement has already been filled
            if (req.isFilled()) return;

            // Check if this course fills this requirement
            var fills = ec.get("groups").some(function(group) {
              return group.id == req.get("group_id");
            });

            if (fills) {
              // Mark that this requirement is filled
              req.setFilled(ec);

              // Mark that this course is being used to fill this requirement,
              // unless this requirement allows courses to be crosslisted
              if (!req.get("allow_crosslisting")) {
                ec.setFills(req);
              }
            }
          });
        }, this));
      }, this));

      // See if any courses that haven't been used could free up a course that
      // is being used for that requirement to be used in a different, unfilled
      // requirement
      var madeSwap = true;
      while (madeSwap) {
        madeSwap = false;

        this.ecs.each(_.bind(function(unfilledEc) {
          // Do nothing if this course is being used already
          if (unfilledEc.isFilling()) return;

          // Check for a course that is being used that could fill both of these
          // requirements
          this.ecs.each(_.bind(function(otherEc) {
            // Don't check a course against itself
            if (unfilledEc.get("id") == otherEc.get("id")) return;

            // Don't try swapping a course that's not filling something
            if (!otherEc.isFilling()) return;

            // Check if what this other course is filling could be filled by
            // the course that's not filling anything
            var fills = unfilledEc.get("groups").some(function(group) {
              return group.id == otherEc.filledWith.get("group_id");
            });
            if (!fills) return;

            // Check if there's an unfilled requirement that could be filled by
            // the other course
            madeSwap = !this.collection.every(function(cat) {
              return cat.get("requirements").every(function(req) {
                var fills = otherEc.get("groups").some(function(group) {
                  return group.id == req.get("group_id");
                });
                if (!req.isFilled() && fills) {
                  var oldReq = otherEc.filledWith;

                  oldReq.setFilled(unfilledEc);
                  unfilledEc.setFills(oldReq);

                  req.setFilled(otherEc);
                  otherEc.setFills(req);

                  return false;
                }

                return true;
              });
            }, this);
          }, this));
        }, this));
      }

      // Try to fill outside technical electives
      var otes = this.collection.findWhere({
        name: "Outside-ECE Technical Electives"
      });
      otes.get("requirements").each(_.bind(function(req) {
        // Search for an OTE course
        this.ecs.each(function(ec) {
          if (!req.isFilled() && !ec.isFilling() && ec.isOTE()) {
            ec.setFills(req);
            req.setFilled(ec);
          }
        });
      }, this));

      // Fill any remaining courses as advisor approved electives
      var electives = this.collection.findWhere({
        name: "Advisor Approved Electives"
      });
      electives.get("requirements").each(_.bind(function(req) {
        // Search for a course that hasn't been used to fill anything
        this.ecs.each(function(ec) {
          if (!req.isFilled() && !ec.isFilling()) {
            ec.setFills(req);
            req.setFilled(ec);
          }
        });
      }, this));

      // Display how many categories are filled in the liberal studies category
      var libstud = this.collection.findWhere({
        name: "Liberal Studies"
      });
      libstud.trigger("displayLSCats");

      // Update the UI with the filled requirements
      this.collection.each(_.bind(function(cat) {
        cat.get("requirements").each(_.bind(function(req) {
          if (req.isFilled()) {
            req.trigger("fill", req.getFilled());
          }
          else {
            req.trigger("unfill");
          }
        }, this));
      }, this));
    }
  });

  window.CategoriesView = CategoriesView;  
})();
