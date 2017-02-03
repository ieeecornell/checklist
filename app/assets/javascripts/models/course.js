(function() {
  var Course = Backbone.Model.extend({
    urlRoot: "/courses",
    url: function() {
      return this.urlRoot + "/" + this.get("id") + ".json";
    }
  });

  window.Course = Course;
})();
