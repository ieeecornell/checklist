(function() {
  var CourseView = ModalView.extend({
    events: _.extend({
      "click .add-code": "addCode",
      "click .add-metadata": "addMetadata",
      "click .delete-code": "removeCode",
      "click .delete-metadata": "removeMetadata",
      "click .save-course": "saveCourse",
      "click .delete-course": "deleteCourse"
    }, ModalView.prototype.events),

    template: _.template($("#course-template").html()),

    render: function() {
      this.$el.html(this.template({data: this.model.attributes}));
    },

    addCode: function(e) {
      e.preventDefault();

      this.$(".codes").append(
        "<li>" +
          "<input type='text' class='code'>" +
          "<a href='#' class='delete delete-code'>&times;</a>" +
        "</li>");
    },

    addMetadata: function(e) {
      e.preventDefault();

      this.$(".metadata").append(
        "<li>" +
          "<input type='text' class='key'>" +
          "<input type='text' class='value'>" +
          "<a href='#'' class='delete delete-metadata'>&times;</a>" +
        "</li>"
      );
    },

    removeCode: function(e) {
      e.preventDefault();

      $(e.target).closest("li").remove();
    },

    removeMetadata: function(e) {
      e.preventDefault();

      $(e.target).closest("li").remove();
    },

    saveCourse: function(e) {
      e.preventDefault();

      // Get all of the attributes
      var title = this.$(".title").val().trim();
      var credits = Number(this.$(".credits").val().trim());
      var codes = [];
      this.$(".code").each(function() {
        var code = $(this).val().trim();
        if (!code) return;
        codes.push(code);
      });
      var metadata = {};
      this.$(".metadata li").each(function() {
        var key = $(this).find(".key").val().trim();
        if (!key) return;
        metadata[key] = $(this).find(".value").val().trim();
      });

      this.model.set({
        title: title,
        credits: credits,
        codes: codes,
        metadata: metadata
      });
      this.$(".save-course").html("Saving&hellip;").addClass("disabled");
      this.model.save(null, {
        success: _.bind(function() {
          this.$(".save-course").html("Saved!").removeClass("disabled");
          setTimeout(function() {
            this.$(".save-course").html("Save");
          }, 1000);
        }, this)
      });
    },

    deleteCourse: function(e) {
      e.preventDefault();

      var msg = "Are you sure you want to delete this course? It cannot be " +
        "undone.";

      if (!confirm(msg)) return;

      this.model.destroy({
        success: _.bind(function() {
          this.closeModal();
        }, this)
      });
    }
  });

  window.CourseView = CourseView;  
})();
