(function() {
  var RequirementView = ModalView.extend({
    events: _.extend({
      "click .save-requirement": "saveRequirement",
      "click .delete-requirement": "deleteRequirement"
    }, ModalView.prototype.events),

    template: _.template($("#requirement-template").html()),

    render: function() {
      var groups = new Groups;
      groups.fetch({
        success: _.bind(function(groups) {
          this.$el.html(this.template({
            req: this.model.attributes,
            groups: groups,
            requirements: this.model.getCategory().get("requirements")
          }));
        }, this)
      });
    },

    saveRequirement: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Get all of the attributes
      var display = $("#display").val().trim();
      var description = $("#description").val().trim();
      var groupId = Number($("#groups").val());
      var allowCrosslisting = $("#allow-crosslisting")[0].checked;
      var sequence = Number($("#sequence").val());

      // Update the model
      this.model.set({
        display: display,
        description: description,
        group_id: groupId,
        allow_crosslisting: allowCrosslisting,
        sequence: sequence
      });

      // Add this model to the collection if it isn't part of it
      if (!this.model.collection) {
        this.model.getCategory().get("requirements").add(this.model);
      }

      // Update affected models that may have been offset by the sequencing
      this.model.collection.each(function(req) {
        if (req.id != this.model.id && req.get("sequence") >= sequence) {
          req.set("sequence", req.get("sequence") + 1);
        }
      }, this)
      this.model.collection.sort();
      this.model.collection.each(function(req, i) {
        req.set("sequence", i);
        
        if (req.id != this.model.id) {
          req.save();
        }
      }, this);

      // Update the button text
      this.$(".save-requirement").html("Saving&hellip;").addClass("disabled");

      // Save the affected courses
      this.model.save(null, {
        success: _.bind(function() {
          // Add the link to the collection if it didn't exist
          if (!this.model.collection) {
            this.model.getCategory().get("requirements").add(this.model);
          }

          // Update the button
          this.$(".save-requirement").html("Saved!").removeClass("disabled");
          setTimeout(function() {
            this.$(".save-requirement").html("Save");
          }, 1000);
        }, this)
      });
    },

    deleteRequirement: function(e) {
      // Don't follow the link
      e.preventDefault();

      var msg = "Are you sure you want to delete this requirement? It cannot " +
        "be undone.";

      if (!confirm(msg)) return;

      this.model.destroy({
        success: _.bind(function() {
          this.closeModal();
        }, this)
      });
    }
  });

  window.RequirementView = RequirementView;
})();
