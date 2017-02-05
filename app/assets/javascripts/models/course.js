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
        url: "/courses.json",
        data: {code: code, limit: 1}
      }).done(_.bind(function(data) {
        if (data.length == 0) {
          this.set({codes: [code]});
        }
        else {
          var fetchCourse = new Course({id: data[0].id});
          fetchCourse.on("change", _.bind(function() {
            var attrs = _.clone(fetchCourse.attributes);
            attrs.code = code;
            this.set(attrs);
          }, this));
          fetchCourse.fetch();
        }
      }, this)).fail(_.bind(function() {
        this.set({codes: [code]});
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
