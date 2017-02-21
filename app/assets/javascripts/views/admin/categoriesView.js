(function() {
  var CategoriesView = Backbone.View.extend({
    tagName: "div",
    className: "admin-content",

    initialize: function() {
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
    }
  });

  window.CategoriesView = CategoriesView;
})();
