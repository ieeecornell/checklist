(function() {
  var Requirement = Backbone.Model.extend({
    urlRoot: function() {
      return "/categories/" + this.get("category").get("id") + "/requirements"
    },
    url: function() {
      return this.urlRoot() + "/" + this.get("id") + ".json";
    },

    getFilled: function() {
      return this.filledWith;
    },

    setFilled: function(course) {
      this.filledWith = course;
    },

    unsetFilled: function() {
      this.filledWith = undefined;
    },

    isFilled: function() {
      return !!this.filledWith;
    }
  });

  window.Requirement = Requirement;
})();
