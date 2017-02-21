(function() {
  var EditCategoryView = ModalView.extend({
    events: _.extend({
      "click .save-category": "saveCategory",
      "click .delete-category": "deleteCategory"
    }, ModalView.prototype.events),

    initialize: function() {
      this.openModal();
    },

    template: _.template($("#edit-category-template").html()),

    render: function() {
      this.$el.html(this.template({
        cat: this.model.attributes,
        categories: this.collection
      }));
    },

    saveCategory: function(e) {
      // Don't follow the link
      e.preventDefault();

      // Get all of the attributes
      var name = $("#name").val().trim();
      var sequence = Number($("#sequence").val());

      // Update the model
      this.model.set({
        name: name,
        sequence: sequence
      });

      // Add this model to the collection if it isn't part of it
      if (!this.model.collection) {
        this.collection.add(this.model);
      }

      // Update affected categories that may have been offset by the sequencing
      this.collection.each(function(cat) {
        if (cat.id != this.model.id && cat.get("sequence") >= sequence) {
          cat.set("sequence", cat.get("sequence") + 1);
        }
      }, this)
      this.collection.sort();
      this.collection.each(function(cat, i) {
        cat.set("sequence", i);
        
        if (cat.id != this.model.id) {
          cat.save();
        }
      }, this);

      // Update the button text
      this.$(".save-category").html("Saving&hellip;").addClass("disabled");

      // Save the category
      this.model.save(null, {
        success: _.bind(function() {
          this.collection.trigger("update");

          // Update the button
          this.$(".save-category").html("Saved!").removeClass("disabled");
          setTimeout(function() {
            this.$(".save-category").html("Save");
          }, 1000);
        }, this)
      });
    },

    deleteCategory: function(e) {
      // Don't follow the link
      e.preventDefault();

      var msg = "Are you sure you want to delete this category? It cannot " +
        "be undone.";

      if (!confirm(msg)) return;

      this.model.destroy({
        success: _.bind(function() {
          this.closeModal();
        }, this)
      });
    }
  });

  window.EditCategoryView = EditCategoryView;
})();
