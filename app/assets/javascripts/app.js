(function() {
    // Display the categories and requirements
    var cats = new Categories;
    var catsView = new CategoriesView({collection: cats});
    catsView.render();

    // Display the enrolled courses form
    var ecs = new EnrolledCourses;
    var ecsView = new EnrolledCoursesView({collection: ecs});
    ecsView.render();

    // Keep the enrolled courses and requirements views in sync
    catsView.setEnrolledCourses(ecs);
})();
