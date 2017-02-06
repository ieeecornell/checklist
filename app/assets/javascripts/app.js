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

    // Save the enrolled courses to local storage every time a change is made
    ecs.on("update", function() {
        localStorage.setItem("courses", JSON.stringify(ecs.toJSON()));
    });

    // Add any courses that were saved to local storage
    cats.on("update", function() {
        ecs.set(JSON.parse(localStorage.getItem("courses")));
    });
})();
