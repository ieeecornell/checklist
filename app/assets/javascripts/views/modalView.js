(function() {
  var ModalView = Backbone.View.extend({
    tagName: "div",
    className: "modal",

    events: {
      "click .modal-bg": "closeModal",
      "click .close-modal": "closeModal"
    },

    initialize: function() {
      if (this.model.isNew()) {
        this.openModal();
      }
      else {
        // Fetch the detals for the course
        this.model.fetch({
          success: _.bind(this.openModal, this)
        });
      }
    },

    openModal: function() {
      this.render();
      this.$el.appendTo("body");
      this.$el.find(".modal-bg").hide().fadeIn(250);
      this.$el.find(".modal-fg").css({
        opacity: 0,
        marginTop: "-50px",
        marginBottom: "50px"
      }).animate({
        opacity: 1,
        marginTop: 0,
        marginBottom: 0
      }, 250);
    },

    closeModal: function(e) {
      if (e && e.preventDefault) e.preventDefault();

      this.$el.find(".modal-bg").fadeOut(250);
      this.$el.find(".modal-fg").animate({
        opacity: 0,
        marginTop: "-50px",
        marginBottom: "50px"
      }, 250, _.bind(function() {
        this.remove();
      }, this));
    }
  });

  window.ModalView = ModalView;  
})();
