(function() {
  var Courses = Backbone.Collection.extend({
    model: Course,

    findByCode: function(code) {
      return this.find(function(course) {
        return _.contains(course.get("codes"), code);
      });
    }
  });

  window.Courses = Courses;
})();
