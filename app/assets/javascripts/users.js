//= require models/course
//= require models/category
//= require models/group
//= require models/requirement
//= require collections/categories
//= require collections/groups
//= require collections/requirements
//= require collections/courses
//= require views/users/requirementView
//= require views/users/requirementsView
//= require views/users/categoryView
//= require views/users/categoriesView
//= require views/users/semesterView
//= require views/users/enrolledCoursesView

(function() {
    // Display the categories and requirements
    var cats = new Categories;
    var catsView = new CategoriesView({collection: cats});
    catsView.render();

    // Display the enrolled courses form
    var ecs = new Courses;
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

    // Create a "semester" for transfer credit
    ecsView.addSemester({label: "Transfer Credit"});
})();

