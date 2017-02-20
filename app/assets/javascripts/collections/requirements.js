(function() {
  var Requirements = Backbone.Collection.extend({
    model: Requirement,
    comparator: "sequence"
  });

  window.Requirements = Requirements;
})();
