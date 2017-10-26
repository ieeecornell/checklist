(function() {
  var GroupsView = Backbone.View.extend({
    tagName: "div",
    className: "admin-content",

    events: {
      "click .groups-list tr": "showGroup",
      "click .add-group": "addGroup"
    },

    initialize: function() {
      this.$el.append(
        "<div class='table-controls'>" +
          "<div class='search'>&nbsp;</div>" +
          "<div class='paging'>" +
            "<a href='#' class='btn btn-positive add-group'>" +
              "Add Group</a>" +
          "</div>" +
        "</div>"
      );
      this.$el.append(
        "<table>" +
          "<thead>" +
            "<tr>" +
              "<th>Group name</th>" +
            "</tr>" +
          "</thead>" +
          "<tbody class='linked groups-list' />" +
        "</table>"
      );
      this.$groupsList = this.$(".groups-list");
      this.$el.appendTo("body");
      
      this.collection = new Groups;
      this.collection.on("update", this.render, this);
      this.collection.fetch();
    },

    render: function() {
      this.$groupsList.empty();
      this.collection.sort();
      this.collection.each(function(group) {
        this.$groupsList.append(
          "<tr data-id='" + group.id + "'><td>" +
            group.get("name") +
          "</td></tr>"
        );
      }, this);
    },

    showGroup: function(e) {
      // Get the ID of the group to show
      var id = Number($(e.target).closest("tr").attr("data-id"));

      // Get the group with this ID
      var group = this.collection.get(id);
      new GroupView({model: group, collection: this.collection});
    },

    addGroup: function(e) {
      e.preventDefault();
    }
  });

  window.GroupsView = GroupsView;
})();
