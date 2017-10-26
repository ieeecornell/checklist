(function() {
  var Groups = Backbone.Collection.extend({
    url: "/groups.json",
    model: Group,

    comparator: "name"
  });

  window.Groups = Groups;
})();
