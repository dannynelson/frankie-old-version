frankieApp.controller('IndexCtrl', function ($scope, Project, navigation, drawer) {

  $scope.init = function() {
    $scope.placeholder = 'http://placehold.it/140x100';
    $scope.projects = [];
    navigation.build(
      'Projects',
      {title: "/icons/plus.png", action: '/views/frankie/new.html'},
      {title: "/icons/lines.png", action: drawer.open}
    );
  };
  $scope.init();

  // Helper function for opening new webviews
  $scope.open = function(id) {
    // localStorage.setItem("currentProject", JSON.stringify($scope.projects[$index]));
    var index;
    for (var i = 0; i < $scope.projects.length; i++) {
      if ($scope.projects[i].id === id) {
        index = i;
      }
    }
    // localStorage.setItem("currentProject", JSON.stringify($scope.projects[index].attributes));
    projectView = new steroids.views.WebView("/views/frankie/show.html?id=" + id);
    steroids.layers.push(projectView);
  };

  $scope.findNextDate = function(project) {
    return moment(project.get('end'), "YYYY-MM-DD").fromNow();
  };

  // Fetch all objects from the backend (see app/models/frankie.js)
  $scope.load = function() {
    Project.get('user', Parse.User.current(), function(results) {
      $scope.projects = results;
      // save to local storage for faster retrieval
      localStorage.setItem("projects", JSON.stringify(results));
      // necessary to update bindings for promises, should be wrapped in function to catch errors?
      $scope.$apply();
    });
  };
  $scope.load();

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