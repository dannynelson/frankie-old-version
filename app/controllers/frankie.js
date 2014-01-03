var frankieApp = angular.module('frankieApp', ['hmTouchevents']);

// Index: http://localhost/views/frankie/index.html

frankieApp.controller('IndexCtrl', function ($scope) {


  // test if user is logged in
  var currentUser = Parse.User.current();
  if (!currentUser) {
    var signinView = new steroids.views.WebView("/views/frankie/signin.html");
    steroids.layers.push(signinView);
  }

  // Build Drawer
  var leftDrawer = new steroids.views.WebView("/views/frankie/drawer.html");
  leftDrawer.preload({},{
    onSuccess: initGesture  // When the view has loaded, enable finger tracking
  });
  function initGesture() {
    steroids.drawers.enableGesture(leftDrawer);
  }
  function showDrawer() {
    steroids.drawers.show(leftDrawer);
  }
  
  // build navigation bar
  steroids.view.navigationBar.show('Calendar');

  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.imagePath = "/icons/plus.png";
  addButton.onTap = function() {
    var newView = new steroids.views.WebView('/views/frankie/new.html');
    steroids.layers.push(newView);
  };

  var settingsButton = new steroids.buttons.NavigationBarButton();
  settingsButton.imagePath = "/icons/cogwheels.png";
  settingsButton.onTap = function() {
    showDrawer();
  };

  steroids.view.navigationBar.setButtons({
    left: [settingsButton],
    right: [addButton]
  });

  // This will be populated with Parse
  $scope.projects = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
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

});


frankieApp.controller('DrawerCtrl', function ($scope) {

  $scope.closeDrawerAndSendMessage = function(selection) {
    var msg = { selection: selection };
    window.postMessage(msg, "*");

    steroids.drawers.hideAll();
  };

  $scope.logout = function() {
    alert('loggin out');
    Parse.User.logOut();
    $scope.closeDrawerAndSendMessage();
    steroids.layers.pop();
  };

});



// New

frankieApp.controller('NewCtrl', function ($scope) {
  steroids.view.navigationBar.show('New Project');

  $scope.create = function(project) {
    var Project = Parse.Object.extend("Project");
    var privateProject = new Project();
    privateProject.set("user", Parse.User.current());
    privateProject.set("title", project.title);
    privateProject.set("notes", project.notes);
    privateProject.setACL(new Parse.ACL(Parse.User.current()));
    privateProject.save();
    alert('saved successfully');
  };

  $scope.openClientInfo = function() {
    var clientInfoView = new steroids.views.WebView("/views/frankie/client-information.html");
    steroids.layers.push(clientInfoView);
  };
});



// Signin

frankieApp.controller('SigninCtrl', function ($scope) {


  $scope.init = function() {
    // Navigation Bar
    // steroids.view.navigationBar.show();
    var signupButton = new steroids.buttons.NavigationBarButton();
    signupButton.title = "signup";
    signupButton.onTap = function() {
      var signupView = new steroids.views.WebView("/views/frankie/signup.html");
      steroids.layers.push(signupView);
    };
    steroids.view.navigationBar.setButtons({
      right: [signupButton],
      overrideBackButton: true
    });
  };
  $scope.init();


  $scope.close = function() {
    steroids.layers.pop();
  };

  // $scope.openSignupPage = function() {
  //   var signupView = new steroids.views.WebView("/views/frankie/signup.html");
  //   steroids.modal.show(signupView);
  // }

  $scope.create = function(user) {
    $scope.loading = true;
    debugger;
    Parse.User.logIn(user.username, user.password, {
      success: function(user) {
        $scope.loading = false;
        alert('login succeeded');
        $scope.close();
      },
      error: function(user, error) {
        $scope.loading = false;
        console.error(error);
        alert("Login error");
      }
    });
  };

  $scope.frankie = {};



});




frankieApp.controller('SignupCtrl', function ($scope) {

  $scope.close = function() {
    steroids.layers.pop();
  };

  $scope.create = function(credentials) {
    $scope.loading = true;

    var user = new Parse.User();
    user.set("username", credentials.username);
    user.set("password", credentials.password);
    user.set("email", credentials.email);
     
    user.signUp(null, {
      success: function(user) {
        $scope.loading = false;
        alert('account created');
        $scope.close();
      },
      error: function(user, error) {
        $scope.loading = false;
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  $scope.frankie = {};

});




// Edit: http://localhost/views/frankie/edit.html

frankieApp.controller('EditCtrl', function ($scope) {

  $scope.project  = JSON.parse(localStorage.getItem("currentProject"));

  //project gets modified by passing into function?
  $scope.update = function(project) {
    // Retrieve Object
    $scope.loading = true;
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    alert(project.objectId);
    query.get(project.objectId, {
      // update and save if successful
      success: function(object) {
        object.set("title", project.title);
        object.set("notes", project.notes);
        object.save();
        $scope.loading = false;
        steroids.layers.pop();
      },
      error: function(object, error) {
        alert(error);
      }
    });
  };

  steroids.view.navigationBar.show('Edit Project');

});






// Show: http://localhost/views/frankie/show.html?id=<id>

frankieApp.controller('ShowCtrl', function ($scope) {

  $scope.project = {};
  
  // retrieve info
  var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);
  query.equalTo("objectId", steroids.view.params.id);
  query.first({
    success: function(object) {
      $scope.project = object;
      // Save current project info to localStorage (edit.html gets it from there)
      localStorage.setItem("currentProject", JSON.stringify(object));
      $scope.$apply();
      setNavigation();
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadFrankie();
    }
  });

  function setNavigation() {
    // -- Native navigation
    steroids.view.navigationBar.show($scope.project.attributes.title);

    var editButton = new steroids.buttons.NavigationBarButton();
    editButton.title = "Edit";

    editButton.onTap = function() {
      editProjectView = new steroids.views.WebView("/views/frankie/edit.html");
      steroids.layers.push(editProjectView);
    };

    steroids.view.navigationBar.setButtons({
      right: [editButton]
    });
  }

});
