(function() {
  var CategoryView = Backbone.View.extend({
    tagName: "li",
    className: "category",

    events: {
      "click h2": "toggleCategoryView"
    },

    initialize: function() {
      this.model.on("displayLSCats", this.displayLSCats, this);
    },

    render: function() {
      var reqs = this.model.get("requirements");
      var reqsView = new RequirementsView({collection: reqs});

      // Add in the category title and requirements
      this.$el
        .append(
          "<h2>" +
            "<span class='arrow' />" +
            "<span class='title'>" + this.model.get("name") + "</span>" +
          "</h2>"
        )
        .append(reqsView.render());

      // Add a label for how many liberal studies categories have been filled,
      // if necessary
      if (this.model.get("name") == "Liberal Studies") {
        this.$("h2").append(
          "<span class='status incomplete'>0/3 categories</span>"
        );
      }

      return this.$el;
    },

    displayLSCats: function() {
      var libstudCats = this.model.get("requirements")
        .reduce(function(acc, req) {
          if (req.isFilled()) {
            acc.push(req.getFilled().get("metadata").libstud);
          }
          return acc;
        }, []);
      var libstudCatsFilled = _.unique(libstudCats).length;

      // Display how many liberal studies categories are filled
      if (libstudCatsFilled < 3) {
        this.$("span.status").removeClass("complete").addClass("incomplete")
          .html(libstudCatsFilled + "/3 categories");
      }
      else {
        this.$("span.status").removeClass("incomplete").addClass("complete")
          .html(libstudCatsFilled + "/3 categories");
      }
    },

    toggleCategoryView: function() {
      this.$el.toggleClass("open");
    }
  });

  window.CategoryView = CategoryView;
})();
