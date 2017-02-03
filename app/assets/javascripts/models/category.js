(function() {
  var Category = Backbone.Model.extend({
    urlRoot: "/categories",
    url: function() {
      return this.urlRoot + "/" + this.get("id") + ".json";
    }
  });

  window.Category = Category;
})();
