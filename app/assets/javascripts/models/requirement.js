(function() {
  var Requirement = Backbone.Model.extend({
    urlRoot: function() {
      var categoryId = this.get("category_id") ||
                       this.get("category") && this.get("category").id ||
                       this.category.id;
      return "/categories/" + categoryId + "/requirements";
    },
    url: function() {
      return this.urlRoot() + (this.get("id") ? "/" + this.get("id") : "") +
        ".json";
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
    },

    getCategory: function() {
      return this.category;
    },

    setCategory: function(cat) {
      this.category = cat;
    }
  });

  window.Requirement = Requirement;
})();
