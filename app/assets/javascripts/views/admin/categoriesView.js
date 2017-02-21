(function() {
  var CategoriesView = Backbone.View.extend({
    tagName: "div",
    className: "admin-content",

    events: {
      "click .add-category": "addCategory"
    },

    initialize: function() {
      this.$el.append(
        "<div class='table-controls'>" +
          "<div class='search'>&nbsp;</div>" +
          "<div class='paging'>" +
            "<a href='#' class='btn btn-positive add-category'>" +
              "Add Category</a>" +
          "</div>" +
        "</div>"
      );
      this.$catsList = $("<ul class='categories-list' />").appendTo(this.$el);
      this.$el.appendTo("body");
      
      this.collection = new Categories;
      this.collection.on("update", this.render, this);
      this.collection.fetch();
    },

    render: function() {
      this.$catsList.empty();
      this.collection.each(function(cat) {
        var catView = new CategoryView({model: cat});
        this.$catsList.append(catView.render());
      }, this);
    },

    addCategory: function(e) {
      e.preventDefault();

      // Open a modal to edit the category
      var cat = new Category({sequence: this.collection.length});
      cat.set("requirements", new Requirements);
      new EditCategoryView({
        model: cat,
        collection: this.collection
      });
    }
  });

  window.CategoriesView = CategoriesView;
})();
