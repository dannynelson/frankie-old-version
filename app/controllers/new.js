frankieApp.controller('NewCtrl', function ($scope, today) {

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