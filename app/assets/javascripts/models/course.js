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
    },

    /**
     * Rudimentary check if the course is an OTE. Returns true iff every subject
     * code is in the engineering school or is a math or science course, and the
     * course is not listed in the ECE school.
     */
    isOTE: function() {
      var ret = true;

      var allowedSubjects = [
        "AEP", "AGSCI", "ANSC", "ASTRO", "BEE", "BIOAP", "BIOEE", "BIOG",
        "BIOMG", "BIOMI", "BIOMS", "BIONB", "BME", "BPRE", "BSOC", "BTRY",
        "CEE", "CHEM", "CHEME", "COGST", "CS", "EAS", "ENGRD", "ESS", "FDSC",
        "INFO", "MAE", "MATH", "MSE", "NS", "NSE", "ORIE", "PHYS", "PLBIO",
        "PLBRG", "PLHRT", "PLPPM", "PLSCI", "PLSCS", "STS", "STSCI", "SYSEN"
      ];

      _.each(this.get("codes"), function(code) {
        var subject = code.replace(/\s.*/, "");
        ret = ret && _.contains(allowedSubjects, subject);
      });

      return ret;
    }
  });

  window.Course = Course;
})();
