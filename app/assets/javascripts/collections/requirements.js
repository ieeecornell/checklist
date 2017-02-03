(function() {
  var Requirements = Backbone.Collection.extend({
    model: Requirement,
    url: "/requirements"
  });

  window.Requirements = Requirements;
})();
