(function() {
  var CategoriesView = Backbone.View.extend({
    tagName: "div",
    className: "admin-content",

    initialize: function() {
      this.collection = new Categories;
      this.collection.on("add", this.addCategory, this);
      this.collection.on("remove", this.removeCategory, this);
      this.collection.fetch();
    },

    addCategory: function(cat) {
      var catView = new CategoryView({model: cat});
      this.$catsList.append(catView.render());
    },

    removeCategory: function(cat) {
      
    },

    render: function() {
      this.$catsList = $("<ul class='categories-list' />").appendTo(this.$el);
      this.$el.appendTo("body");
    }
  });

  window.CategoriesView = CategoriesView;
})();
