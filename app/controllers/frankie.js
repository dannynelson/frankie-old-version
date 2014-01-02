var frankieApp = angular.module('frankieApp', ['hmTouchevents']);

// New: http://localhost/views/frankie/new.html

frankieApp.controller('SigninCtrl', function ($scope) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(credentials) {
    $scope.loading = true;
    Parse.User.logIn(credentials.username, credentials.password, {
      success: function(user) {
        $scope.loading = false;
        alert('login succeeded');
        var appView = new steroids.views.WebView('/views/frankie/index.html');
        steroids.modal.show('');
      },
      error: function(user, error) {
        $scope.loading = false;
        console.error(error);
        alert("Login error");
      }
    });
  };

  $scope.frankie = {};

  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show();
  // ..and add a button to it
  var signupButton = new steroids.buttons.NavigationBarButton();
  signupButton.title = "signup";

  // ..set callback for tap action
  signupButton.onTap = function() {
    var signupView = new steroids.views.WebView("/views/frankie/signup.html");
    steroids.layers.push(signupView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [signupButton]
  });

});

frankieApp.controller('SignupCtrl', function ($scope) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(credentials) {
    $scope.loading = true;

    var user = new Parse.User();
    user.set("username", "my name");
    user.set("password", "my pass");
    user.set("email", "email@example.com");
     
    // other fields can be set just like with Parse.Object
    user.set("phone", "415-392-0202");
     
    user.signUp(null, {
      success: function(user) {
        $scope.loading = false;
        alert('account created');
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

// frankieApp.controller('EditCtrl', function ($scope, FrankieRestangular) {

//   var id  = localStorage.getItem("currentFrankieId"),
//       frankie = FrankieRestangular.one("frankie", id);

//   $scope.close = function() {
//     steroids.modal.hide();
//   };

//   $scope.update = function(frankie) {
//     $scope.loading = true;

//     frankie.put().then(function() {

//       // Notify the show.html to reload data
//       var msg = { status: "reload" };
//       window.postMessage(msg, "*");

//       $scope.close();
//       $scope.loading = false;
//     }, function() {
//       $scope.loading = false;

//       alert("Error when editing the object, is Restangular configured correctly, are the permissions set correctly?");
//     });

//   };

//   // Helper function for loading frankie data with spinner
//   $scope.loadFrankie = function() {
//     $scope.loading = true;

//     // Fetch a single object from the backend (see app/models/frankie.js)
//     frankie.get().then(function(data) {
//       $scope.frankie = data;
//       $scope.loading = false;
//     });
//   };

//   $scope.loadFrankie();

// });



// Index: http://localhost/views/frankie/index.html

// frankieApp.controller('IndexCtrl', function ($scope, FrankieRestangular) {

//   // This will be populated with Restangular
//   $scope.frankies = [];

//   // Helper function for opening new webviews
//   $scope.open = function(id) {
//     webView = new steroids.views.WebView("/views/frankie/show.html?id="+id);
//     steroids.layers.push(webView);
//   };

//   // Helper function for loading frankie data with spinner
//   $scope.loadFrankies = function() {
//     $scope.loading = true;

//     frankies.getList().then(function(data) {
//       $scope.frankies = data;
//       $scope.loading = false;
//     });

//   };

//   // Fetch all objects from the backend (see app/models/frankie.js)
//   var frankies = FrankieRestangular.all('frankie');
//   $scope.loadFrankies();


//   // Get notified when an another webview modifies the data and reload
//   window.addEventListener("message", function(event) {
//     // reload data on message with reload status
//     if (event.data.status === "reload") {
//       $scope.loadFrankies();
//     }
//   });

// });


// Show: http://localhost/views/frankie/show.html?id=<id>

// frankieApp.controller('ShowCtrl', function ($scope, FrankieRestangular) {

//   // Helper function for loading frankie data with spinner
//   $scope.loadFrankie = function() {
//     $scope.loading = true;

//      frankie.get().then(function(data) {
//        $scope.frankie = data;
//        $scope.loading = false;
//     });

//   };

//   // Save current frankie id to localStorage (edit.html gets it from there)
//   localStorage.setItem("currentFrankieId", steroids.view.params.id);

//   var frankie = FrankieRestangular.one("frankie", steroids.view.params.id);
//   $scope.loadFrankie();

//   // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
//   window.addEventListener("message", function(event) {
//     if (event.data.status === "reload") {
//       $scope.loadFrankie();
//     }
//   });

//   // -- Native navigation
//   steroids.view.navigationBar.show("Frankie: " + steroids.view.params.id );

//   var editButton = new steroids.buttons.NavigationBarButton();
//   editButton.title = "Edit";

//   editButton.onTap = function() {
//     webView = new steroids.views.WebView("/views/frankie/edit.html");
//     steroids.modal.show(webView);
//   };

//   steroids.view.navigationBar.setButtons({
//     right: [editButton]
//   });

// });