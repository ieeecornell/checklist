(function() {
  var Course = Backbone.Model.extend({
    urlRoot: "/courses",
    url: function() {
      return this.urlRoot + "/" + this.get("id") + ".json";
    },

    initialize: function() {
      this.reqs = [];

      this.on("change:groups", this.parseGroups);
    },

    fetchByCode: function(code) {
      $.ajax({
        url: "/courses/" + encodeURIComponent(code) + ".json"
      }).done(_.bind(function(data) {
        if (data.length == 0) {
          this.set({codes: [code], groups: []});
        }
        else {
          data.code = code;
          this.set(data);
        }
      }, this)).fail(_.bind(function() {
        this.set({codes: [code], groups: []});
      }, this));
    },

    /**
     * Automatically parses groups into a collection of groups.
     */
    parseGroups: function() {
      if (_.isArray(this.get("groups"))) {
        this.set("groups", new Groups(this.get("groups")), {silent: true});
      }
    },

    setFills: function(req) {
      this.filledWith = req;
    },

    unsetFills: function() {
      this.filledWith = undefined;
    },

    isFilling: function() {
      return !!this.filledWith;
    }
  });

  window.Course = Course;
})();
