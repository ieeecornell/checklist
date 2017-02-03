(function() {
  var CategoriesView = Backbone.View.extend({
    el: "ul.checklist",

    /**
     * Renders the categories.
     */
    render: function() {
      this.collection.on("add", this.displayCategory, this);
      this.collection.fetch();
    },

    /**
     * Displays a single category in the proper place.
     * @param cat The category to display
     */
    displayCategory: function(cat) {
      var catView = new CategoryView({model: cat});
      this.$el.append(catView.render());
    }
  });

  window.CategoriesView = CategoriesView;  
})();
