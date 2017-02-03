(function() {
  var RequirementView = Backbone.View.extend({
    tagName: "li",

    render: function() {
      return this.$el
        .append("<h3>" + this.model.get("display") + "</h3>")
        .append("<span class='incomplete'><em>Incomplete</em></span>");
    }
  });

  window.RequirementView = RequirementView;
})();
