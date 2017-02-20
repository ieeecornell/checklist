(function() {
  var CategoryView = Backbone.View.extend({
    tagName: "li",
    className: "category",

    events: {
      "click .reqs li:not(.add-requirement)": "showRequirement",
      "click .reqs .add-requirement": "addRequirement"
    },

    initialize: function() {
      this.model.get("requirements").on("update", this.render, this);
    },

    render: function() {
      // Add the title and description
      this.$el.empty().append(
        "<div class='title-desc'>" +
          "<h2>" + this.model.get("name") + "</h2>" +
        "</div>"
      );

      // Add the requirements
      var $reqsList = $("<ul class='reqs' />").appendTo(this.$el);
      this.model.get("requirements").each(function(req) {
        $reqsList.append(
          "<li data-id='" + req.get("id") + "'>" +
            req.get("display") + "<span class='arrow'>&rarr;</span>" +
          "</li>"
        );
      });

      $reqsList.append(
        "<li class='add-requirement'>" +
          "<em>Add requirement</em><span class='arrow'>&rarr;</span>" +
        "</li>"
      );

      return this.$el;
    },

    showRequirement: function(e) {
      // Get the ID of the requirement
      var $li = $(e.target).closest("li");
      var id = Number($li.attr("data-id"));

      // Find the requirement
      var req = this.model.get("requirements").findWhere({id: id});
      req.setCategory(this.model);

      // Show this requirement
      var reqView = new RequirementView({model: req});
    },

    addRequirement: function(e) {
      // Open a requirement modal
      var req = new Requirement;
      req.set("sequence", this.model.get("requirements").length);
      req.setCategory(this.model);
      new RequirementView({model: req});
    }
  });

  window.CategoryView = CategoryView;
})();
