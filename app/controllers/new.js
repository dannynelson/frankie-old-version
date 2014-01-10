frankieApp.controller('NewCtrl', function ($scope, today, navigation, Photo, Project) {
  $scope.init = function() {
    $scope.project = {
      start: today,
      end: today
    };
    navigation.build(
      'New Project',
      {title: "Save", action: function() { $scope.create($scope.project); } },
      {title: "Cancel", action: steroids.layers.pop }
    );
  };
  $scope.init();
  

  $scope.uploadPhoto = function() {
    document.getElementById('photo').click();
  };

  $scope.create = function(project) {

    if (!$scope.project.title) {
      alert('Please enter a title.');
      return;
    }
    var saveObject = function() {
      if (photoURL) $scope.project.photoURL = photoURL;
      alert($scope.project.photoURL);
      Project.save($scope.project, function(object) {
        alert('New object created with objectId: ' + object.id);
        // Notify the index.html to reload
        var msg = { status: 'reload' };
        window.postMessage(msg, "*");
        // Clear local storage
        localStorage.removeItem('timeline');
        localStorage.removeItem('clientInfo');
        // Return to index
        steroids.layers.pop();
      });
    };

    if ($scope.photo) {
      var photoURL;
      Photo.save($scope.photo, function(file) {
        photoURL = file.url();
        saveObject();
      });
    } else {
      saveObject();
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


  window.addEventListener("message", function(event) {
    if (event.data.status === "clientUpdated") {
      $scope.project.clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
    }
    if (event.data.status === "timelineUpdated") {
      $scope.project.timeline = JSON.parse(localStorage.getItem('timeline'));
    }
    $scope.$apply();
  });
});