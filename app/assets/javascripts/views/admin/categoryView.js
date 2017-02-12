(function() {
  var CategoryView = Backbone.View.extend({
    tagName: "li",
    className: "category",

    render: function() {
      // Add the title and description
      this.$el.append(
        "<div class='title-desc'>" +
          "<h2>" + this.model.get("name") + "</h2>" +
          (this.model.get("description") ?
            "<p>" + this.model.get("description") + "</p>" : "") +
        "</div>"
      );

      // Add the requirements
      var $reqsList = $("<ul class='reqs' />").appendTo(this.$el);
      this.model.get("requirements").each(function(req) {
        $reqsList.append(
          "<li>" +
            req.get("display") + "<span class='arrow'>&rarr;</span>" +
          "</li>"
        );
      });

      return this.$el;
    }
  });

  window.CategoryView = CategoryView;
})();
