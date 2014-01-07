var frankieApp = angular.module('frankieApp', ['hmTouchevents']);

frankieApp.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        };
        reader.readAsDataURL(changeEvent.target.files[0]);
      });
    }
  };
}]);
// Index: http://localhost/views/frankie/index.html

frankieApp.controller('IndexCtrl', function ($scope) {

  $scope.placeholder = 'http://placehold.it/140x100';

  // Build Drawer
  var leftDrawer = new steroids.views.WebView("/views/frankie/drawer.html");
  leftDrawer.preload({},{
    onSuccess: initGesture  // When the view has loaded, enable finger tracking
  });
  function initGesture() {
    steroids.drawers.enableGesture(leftDrawer);
  }
  
  // build navigation bar
  steroids.view.navigationBar.hide();
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
        debugger;
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


frankieApp.controller('DrawerCtrl', function ($scope) {

  $scope.logout = function() {
    Parse.User.logOut();
    steroids.drawers.hideAll();

    //send message to for index.html to logout
    var msg = { status: "logout" };
    window.postMessage(msg, "*");
  };

});



// New

frankieApp.controller('NewCtrl', function ($scope) {

  // generate current date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = yyyy+'-'+mm+'-'+dd;

  $scope.project = {
    start: today,
    end: today
  };

  $scope.create = function(project) {
    // save everything else
    var saveObject = function() {
      alert('saving object');
      var Project = Parse.Object.extend("Project");
      var privateProject = new Project();
      privateProject.set(project);
      privateProject.set("photo", parseFile);
      privateProject.set("timeline", [{description:"cat"},{date:"1234"}]);
      privateProject.set("user", Parse.User.current());
      privateProject.set("clientInfo", JSON.parse(localStorage.getItem("clientInfo")));
      privateProject.setACL(new Parse.ACL(Parse.User.current()));
      privateProject.save(null, {
        success: function(object) {
            alert('New object created with objectId: ' + object.id);
          },
          error: function(object, error) {
            alert('Failed to create new object, with error code: ' + error.description);
          }
      });

      // Notify the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");
      steroids.layers.pop();
    };

    if ($scope.photo) {
      var base64 = $scope.photo.split('base64,')[1];
      var parseFile = new Parse.File("photo.jpg", { base64: base64 });
      parseFile.save().then(function() {
        alert('file saved');
        saveObject();
      }, function(error) {
        alert(error);
      });
    }
  };

  $scope.openTimeline = function() {
    var timelineView = new steroids.views.WebView("/views/frankie/timeline.html");
    steroids.layers.push(timelineView);
  };

  $scope.openClientInfo = function() {
    var clientInfoView = new steroids.views.WebView("/views/frankie/client-information.html");
    steroids.layers.push(clientInfoView);
  };


  // navigationbar
  steroids.view.navigationBar.show('New Project');

  var cancelButton = new steroids.buttons.NavigationBarButton();
  cancelButton.title = "cancel";
  cancelButton.onTap = function() {
    steroids.layers.pop();
  };

  var saveButton = new steroids.buttons.NavigationBarButton();
  saveButton.title = "save";
  saveButton.onTap = function() {
    $scope.create($scope.project);
  };
  steroids.view.navigationBar.setButtons({
    left: [cancelButton],
    right: [saveButton],
    overrideBackButton: true
  });
});

// Edit: http://localhost/views/frankie/edit.html

frankieApp.controller('EditCtrl', function ($scope) {

  $scope.project = JSON.parse(localStorage.getItem("currentProject"));

  //project gets modified by passing into function?
  $scope.update = function(project) {
    // Retrieve Object
    $scope.loading = true;
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    query.get(project.objectId, {
      // update and save if successful
      success: function(object) {
        object.set(project);
        object.save();
        $scope.loading = false;
        steroids.layers.pop();
      },
      error: function(object, error) {
        alert(error);
      }
    });
  };

  $scope.openClientInfo = function() {
    localStorage.setItem("clientInfo", JSON.stringify($scope.project.clientInfo));
    var clientInfoView = new steroids.views.WebView("/views/frankie/update-client.html");
    steroids.layers.push(clientInfoView);
  };

  steroids.view.navigationBar.show('Edit Project');

});



// Signin

frankieApp.controller('SigninCtrl', function ($scope) {

  $scope.init = function() {
    // Landing class to add purple background
    document.body.className = "landing";

    // Navigation Bar
    steroids.view.navigationBar.show();
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

  $scope.showSignupView = function() {
    var signupView = new steroids.views.WebView("/views/frankie/signup.html");
    steroids.modal.hide();
    steroids.modal.show(signupView);
  };

  $scope.showIndexView = function() {
    var indexView = new steroids.views.WebView("/views/frankie/index.html");
    steroids.layers.push(indexView);

    // can only preload once
    // indexView.preload({},{
    //   onSuccess: function() {
    //     steroids.layers.push(indexView);
    //   }
    // });
    
  };

  $scope.create = function(user) {
    $scope.loading = true;

    Parse.User.logIn(user.username, user.password, {
      success: function(user) {
        $scope.loading = false;

        // // send message to reload data
        // var msg = { status: 'reload' };
        // window.postMessage(msg, "*");

        $scope.showIndexView();
      },
      error: function(user, error) {
        $scope.loading = false;
        alert("Invalid Username or Password");
      }
    });
  };

  $scope.frankie = {};

  // test if user is logged in
  var currentUser = Parse.User.current();
  if (currentUser) {
    $scope.showIndexView();
  }

});





frankieApp.controller('SignupCtrl', function ($scope) {

  // Landing class to add purple background
  document.body.className = "landing";
  
  $scope.close = function() {
    steroids.layers.pop();
  };

  $scope.create = function(credentials) {
    $scope.loading = true;

    var user = new Parse.User();
    user.set(credentials);
     
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











// Show: http://localhost/views/frankie/show.html?id=<id>

frankieApp.controller('ShowCtrl', function ($scope) {

  $scope.project = {};
  
  // retrieve info
  var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);
  query.equalTo("objectId", steroids.view.params.id);
  query.first({
    success: function(object) {
      $scope.project = object.attributes;
      // Save current project info to localStorage (edit.html gets it from there)
      localStorage.setItem("currentProject", JSON.stringify(object.attributes));
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
    steroids.view.navigationBar.show($scope.project.title);

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

frankieApp.controller('ClientCtrl', function ($scope) {
  steroids.view.navigationBar.show('Client Info');

  $scope.create = function(input) {
    // var Client = Parse.Object.extend("Client");
    // var client = new Client();
    // client.set("firstName", input.firstName);
    // client.set("lastName", input.lastName);
    // client.set("phone", input.phone);
    // client.set("email", input.email);

    var client = {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email
    };
    localStorage.setItem("clientInfo", JSON.stringify(client));

    steroids.layers.pop();
  };
});

frankieApp.controller('UpdateClientCtrl', function ($scope) {
  
  steroids.view.navigationBar.show('Update Client');

  $scope.client = JSON.parse(localStorage.getItem("clientInfo"));
  
  $scope.create = function(input) {

    var client = {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email
    };

    localStorage.setItem("clientInfo", JSON.stringify(client));

    steroids.layers.pop();
  };
});


frankieApp.controller('TimelineCtrl', function ($scope) {
  
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = yyyy+'-'+mm+'-'+dd;

  $scope.addMilestone = function() {

    $scope.milestones.push({
      description: "",
      date: today
    });
    
  };

  $scope.milestones = [
    {
      description: "",
      date: today
    }
  ];

  // Add navigation
  steroids.view.navigationBar.show('Timeline');
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.imagePath = "/icons/plus.png";
  addButton.onTap = function() {
    $scope.$apply($scope.addMilestone());
  };
  steroids.view.navigationBar.setButtons({
    right: [addButton],
  });



  $scope.save = function() {
    // localStorage.setItem("timeline", JSON.stringify($scope.milestones));
    localStorage.setItem("timeline", angular.toJson($scope.milestones));

    steroids.layers.pop();
  };
});
