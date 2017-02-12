(function() {
  var Categories = Backbone.Collection.extend({
    model: Category,
    url: "/categories.json",

    parse: function(response) {
      return _.map(response, function(cat) {
        cat.requirements = new Requirements(cat.requirements);
        return cat;
      });
    }
  });

  window.Categories = Categories;
})();
