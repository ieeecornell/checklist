(function() {
  var EnrolledCourses = Backbone.Collection.extend({
    model: Course,

    findByCode: function(code) {
      return this.find(function(course) {
        return _.contains(course.get("codes"), code);
      });
    }
  });

  window.EnrolledCourses = EnrolledCourses;
})();
