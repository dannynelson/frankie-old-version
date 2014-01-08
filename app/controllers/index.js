frankieApp.controller('IndexCtrl', function ($scope) {

  $scope.placeholder = 'http://placehold.it/140x100';

  // Build Drawer
  var leftDrawer = new steroids.views.WebView("/views/frankie/drawer.html");
  // leftDrawer.preload({},{
  //   onSuccess: initGesture  // When the view has loaded, enable finger tracking
  // });
  function initGesture() {
    steroids.drawers.enableGesture(leftDrawer);
  }
  
  // build navigation bar
  steroids.view.navigationBar.show('Calendar');
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = 'add';
  // addButton.imagePath = "/icons/plus.png";
  addButton.onTap = function() {
    var newView = new steroids.views.WebView('/views/frankie/new.html');
    steroids.layers.push(newView);
  };
  var settingsButton = new steroids.buttons.NavigationBarButton();
  settingsButton.imagePath = "/icons/cogwheels.png";
  settingsButton.onTap = function() {
    steroids.drawers.show(leftDrawer);
  };
  steroids.view.navigationBar.setButtons({
    left: [settingsButton],
    right: [addButton],
    overrideBackButton: true
  });

  // This will be populated with Parse
  $scope.projects = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    debugger;
    projectView = new steroids.views.WebView("/views/frankie/show.html?id="+id);
    steroids.layers.push(projectView);
  };

  // Fetch all objects from the backend (see app/models/frankie.js)
  $scope.load = function() {
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    query.equalTo("user", Parse.User.current());
    query.find({
      success: function(results) {
        $scope.projects = results;
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
      steroids.layers.pop();
    }
  });
});