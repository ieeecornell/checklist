(function() {
  var Groups = Backbone.Collection.extend({
    url: "/groups.json",
    model: Group
  });

  window.Groups = Groups;
})();
