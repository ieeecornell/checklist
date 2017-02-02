(function() {
    // -------------------------------------------------------------------------
    // Adding/removing courses that have been taken
    // -------------------------------------------------------------------------

    var courses = [];
    var semesters = [];

    // Maps a semester value to a semester label
    var semesterMap = {
        "S": "Spring",
        "Su": "Summer",
        "F": "Fall",
        "W": "Winter"
    };

    // Allow a new semester to get added
    console.log($("#add-semester-form"));
    $("#add-semester-form").on("submit", function(e) {
        // Don't actually submit the form
        e.preventDefault();

        // Get the semester and year (convert the year to a number, and prefix
        // it with "20" if only the last two digits were entered)
        var semester = $("#semester").val();
        var year = $("#year").val();
        if (year.length == 2) year = "20" + year;
        year = Number(year);

        // Create a new semester <li>
        var $li = $("<li>", {
            "data-semester": semester,
            "data-year": year,
            "class": "semester"
        });
        $li.append("<h2>" + semesterMap[semester] + " " + year + "</h2>");

        // Add the new semester to the list of semesters
        $("#course-list").append($li);
    });
})();
