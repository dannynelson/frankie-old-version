frankieApp.controller('CalendarCtrl', function ($scope, today) {

  $scope.placeholder = 'http://placehold.it/140x100';
  steroids.view.navigationBar.show("Calendar");

  // This will be populated with Parse
  $scope.projects = [];
  $scope.overDueProjects = [];
  $scope.dueLaterProjects = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    // localStorage.setItem("currentProject", JSON.stringify($scope.projects[$index]));
    projectView = new steroids.views.WebView("/views/frankie/show.html?id=" + id);
    steroids.layers.push(projectView);
  };

  $scope.findNextDate = function(project) {
    return moment(project.get('end'), "YYYY-MM-DD").fromNow();
  };

  // Fetch all objects from the backend (see app/models/frankie.js)
  $scope.load = function() {
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    query.equalTo("user", Parse.User.current());
    query.find({
      success: function(results) {
        $scope.projects = results;
        $scope.sortProjects($scope.projects);
        // save to local storage for faster retrieval
        // localStorage.setItem("projects", JSON.stringify(results));
        // necessary to update bindings for promises, should be wrapped in function to catch errors?
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
  $scope.load();


  $scope.sortProjects = function(arrayOfProjects) {
    for(var i = 0; i < arrayOfProjects.length; i++){
      if(arrayOfProjects[i].attributes.end <= today){
        $scope.overDueProjects.push(arrayOfProjects[i]);
      } else {
        $scope.dueLaterProjects.push(arrayOfProjects[i]);
      }
    }
  };
  

  // Event listeners
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.load();
    }
    if (event.data.status === "logout") {
      // steroids.layers.pop();
      steroids.layers.popAll();
    }
  });
});