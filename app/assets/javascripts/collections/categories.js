(function() {
  var Categories = Backbone.Collection.extend({
    model: Category,
    url: "/categories"
  });

  window.Categories = Categories;
})();
