(function() {
  var Group = Backbone.Model.extend({
    url: function() {
      return "/groups" + (this.has("id") ? "/" + this.get("id") : "") + ".json";
    }
  });

  window.Group = Group;
})();
