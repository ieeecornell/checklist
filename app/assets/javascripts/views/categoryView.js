(function() {
  var CategoryView = Backbone.View.extend({
    tagName: "li",
    className: "category",

    render: function() {
      var reqs = this.model.get("requirements");
      var reqsView = new RequirementsView({collection: reqs});

      return this.$el
        .append(
          "<h2><span class='title'>" + this.model.get("name") + "</span></h2>"
        )
        .append(reqsView.render());
    }
  });

  window.CategoryView = CategoryView;
})();
