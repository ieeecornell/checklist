(function() {
  var Categories = Backbone.Collection.extend({
    model: Category,
    url: "/categories.json",

    comparator: "sequence",

    parse: function(response) {
      return _.map(response, function(cat) {
        cat.requirements = new Requirements(cat.requirements);
        cat.requirements.each(function(req) {
          req.set("category_id", cat.id);
        });
        return cat;
      });
    }
  });

  window.Categories = Categories;
})();
