(function() {
  var Requirement = Backbone.Model.extend({
    urlRoot: function() {
      return "/categories/" + this.get("category").get("id") + "/requirements"
    },
    url: function() {
      return this.urlRoot() + "/" + this.get("id") + ".json";
    }
  });

  window.Requirement = Requirement;
})();
