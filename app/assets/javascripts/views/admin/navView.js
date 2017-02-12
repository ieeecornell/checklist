(function() {
  var NavView = Backbone.View.extend({
    el: "aside.sidebar-nav",

    events: {
      "click a": "switchView"
    },

    initialize: function() {
      // Show the courses view by default
      this.currentView = "cats";
      this.loadView();
    },

    switchView: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Figure out which view to load
      this.currentView = $(e.target).attr("data-view");

      // Load the proper view
      this.loadView();
    },

    loadView: function() {
      // Remove the old view
      if (this.view) this.view.remove();

      // Unmark the old view as selected
      this.$(".selected").removeClass("selected");

      switch (this.currentView) {
        case "courses":
          this.view = new CoursesView;
          this.$("[data-view='courses']").addClass("selected");
          break;
        case "cats":
          this.view = new CategoriesView;
          this.$("[data-view='cats']").addClass("selected");
          break;
      }

      // Render the view
      this.view.render();
    }
  });

  window.NavView = NavView;  
})();
