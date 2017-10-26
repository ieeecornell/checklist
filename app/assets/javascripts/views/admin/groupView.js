(function() {
  var GroupView = ModalView.extend({
    events: _.extend({
      "click .add-course": "addCourse",
      "click .save-group:not(.disabled)": "saveGroup",
      "click .delete-group": "deleteGroup"
    }, ModalView.prototype.events),

    initialize: function() {
      this.openModal();
    },

    template: _.template($("#group-template").html()),

    render: function() {
      this.$el.html(this.template({group: this.model.attributes}));
    },

    saveGroup: function(e) {
      e.preventDefault();

      // Get the attributes
      var name = $("#name").val().trim();
      var addCodes = $("#add-courses").val().trim();
      var removeCodes = $("#remove-courses").val().trim();

      // Update the model
      this.model.set({name: name});
      this.model.save();
      this.collection.trigger("update");

      // Update the courses in the group
      this.$(".save-group").html("Saving&hellip;").addClass("disabled");
      $.ajax({
        url: "/courses_groups.json",
        type: "put",
        data: {
          add_codes: addCodes,
          remove_codes: removeCodes,
          group_id: this.model.id
        }
      }).done(_.bind(function() {
        this.$(".save-group").html("Saved!").removeClass("disabled");
        setTimeout(function() {
          this.$(".save-group").html("Save");
        }, 1000);
      }, this)).fail(_.bind(function() {
        this.$(".save-group").html("Error saving").removeClass("disabled");
        setTimeout(function() {
          this.$(".save-group").html("Save");
        }, 1000);
      }, this));
    },

    deleteGroup: function(e) {
      e.preventDefault();

      var msg = "Are you sure you want to delete this group? It cannot be " +
        "undone.";

      if (!confirm(msg)) return;

      this.model.destroy({
        success: _.bind(function() {
          this.closeModal();
        }, this)
      });
    }
  });

  window.GroupView = GroupView;  
})();
