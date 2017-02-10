(function() {
  var RequirementsView = Backbone.View.extend({
    tagName: "ul",

    /**
     * Renders the categories.
     */
    render: function() {
      this.collection.each(function(req) {
        var reqView = new RequirementView({model: req});
        this.$el.append(reqView.render());
      }, this);

      return this.$el;
    }
  });

  window.RequirementsView = RequirementsView;  
})();
