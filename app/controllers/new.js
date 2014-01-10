frankieApp.controller('NewCtrl', function ($scope, today, navigation) {
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
      alert('saving object');
      var Project = Parse.Object.extend("Project");
      var privateProject = new Project();
      privateProject.set(project);
      if (parseFile) privateProject.set("photoURL", parseFile.url());
      if ($scope.project.timeline) privateProject.set("timeline", $scope.project.timeline);
      if ($scope.project.clientInfo) privateProject.set("clientInfo", $scope.project.clientInfo);
      privateProject.set("user", Parse.User.current());
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
      // Clear local storage
      localStorage.removeItem('timeline');
      localStorage.removeItem('clientInfo');

      // Return to index
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