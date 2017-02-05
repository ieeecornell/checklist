(function() {
  var RequirementView = Backbone.View.extend({
    tagName: "li",

    initialize: function() {
      this.model.on("fill", this.fillReq, this);
      this.model.on("unfill", this.unfillReq, this);
    },

    render: function() {
      return this.$el
        .append("<h3>" + this.model.get("display") + "</h3>")
        .append(
          "<span class='incomplete'>" +
            "<em>Incomplete</em>" +
          "</span>"
        );
    },

    fillReq: function(course) {
      this.$("span").removeClass("incomplete").addClass("complete")
        .html(course.get("code"));
    },

    unfillReq: function() {
      this.$("span").removeClass("complete").addClass("incomplete")
        .html("<em>Incomplete</em>");
    }
  });

  window.RequirementView = RequirementView;
})();
