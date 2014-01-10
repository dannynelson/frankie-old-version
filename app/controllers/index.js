frankieApp.controller('IndexCtrl', function ($scope, navigation) {

  $scope.placeholder = 'http://placehold.it/140x100';

  // Build Drawer
  var leftDrawer = new steroids.views.WebView("/views/frankie/drawer.html");
  var leftDrawerShowing = false;
  leftDrawer.preload();
  // leftDrawer.preload({},{
  //   onSuccess: initGesture  // When the view has loaded, enable finger tracking
  // });
  // function initGesture() {
  //   steroids.drawers.enableGesture(leftDrawer);
  // }
  $scope.add = function() {
    var newView = new steroids.views.WebView('/views/frankie/new.html');
    steroids.layers.push(newView);
  };

  $scope.openDrawer = function() {
    if (!leftDrawerShowing) {
      leftDrawerShowing = true;
      steroids.drawers.show(leftDrawer);
    } else {
      leftDrawerShowing = false;
      steroids.drawers.hide();
    }
  };

  navigation.build(
    'Projects',
    {title: "/icons/plus.png", action: $scope.add},
    {title: "/icons/lines.png", action: $scope.openDrawer}
  );

  // This will be populated with Parse
  $scope.projects = [];

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
        // save to local storage for faster retrieval
        localStorage.setItem("projects", JSON.stringify(results));
        // necessary to update bindings for promises, should be wrapped in function to catch errors?
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
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