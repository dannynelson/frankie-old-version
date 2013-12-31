var frankieApp = angular.module('frankieApp', ['FrankieModel', 'hmTouchevents']);


// Index: http://localhost/views/frankie/index.html

frankieApp.controller('IndexCtrl', function ($scope, FrankieRestangular) {

  // This will be populated with Restangular
  $scope.frankies = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/frankie/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading frankie data with spinner
  $scope.loadFrankies = function() {
    $scope.loading = true;

    frankies.getList().then(function(data) {
      $scope.frankies = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/frankie.js)
  var frankies = FrankieRestangular.all('frankie');
  $scope.loadFrankies();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadFrankies();
    };
  });


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Frankie index");

  // ..and add a button to it
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = "Add";

  // ..set callback for tap action
  addButton.onTap = function() {
    var addView = new steroids.views.WebView("/views/frankie/new.html");
    steroids.modal.show(addView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [addButton]
  });


});


// Show: http://localhost/views/frankie/show.html?id=<id>

frankieApp.controller('ShowCtrl', function ($scope, FrankieRestangular) {

  // Helper function for loading frankie data with spinner
  $scope.loadFrankie = function() {
    $scope.loading = true;

     frankie.get().then(function(data) {
       $scope.frankie = data;
       $scope.loading = false;
    });

  };

  // Save current frankie id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentFrankieId", steroids.view.params.id);

  var frankie = FrankieRestangular.one("frankie", steroids.view.params.id);
  $scope.loadFrankie()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadFrankie()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Frankie: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/frankie/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/frankie/new.html

frankieApp.controller('NewCtrl', function ($scope, FrankieRestangular) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(frankie) {
    $scope.loading = true;

    FrankieRestangular.all('frankie').post(frankie).then(function() {

      // Notify the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;

    }, function() {
      $scope.loading = false;

      alert("Error when creating the object, is Restangular configured correctly, are the permissions set correctly?");

    });

  }

  $scope.frankie = {};

});


// Edit: http://localhost/views/frankie/edit.html

frankieApp.controller('EditCtrl', function ($scope, FrankieRestangular) {

  var id  = localStorage.getItem("currentFrankieId"),
      frankie = FrankieRestangular.one("frankie", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(frankie) {
    $scope.loading = true;

    frankie.put().then(function() {

      // Notify the show.html to reload data
      var msg = { status: "reload" };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;
    }, function() {
      $scope.loading = false;

      alert("Error when editing the object, is Restangular configured correctly, are the permissions set correctly?");
    });

  };

  // Helper function for loading frankie data with spinner
  $scope.loadFrankie = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/frankie.js)
    frankie.get().then(function(data) {
      $scope.frankie = data;
      $scope.loading = false;
    });
  };

  $scope.loadFrankie();

});