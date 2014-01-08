frankieApp.controller('ShowCtrl', function ($scope) {

  $scope.placeholder = 'http://placehold.it/140x100';

  $scope.project = {};

  $scope.uploadPhoto = function() {
    alert('photo uploaded');
    document.getElementById('file').click();
  };

  //why is this getting called on initialize?
  $scope.savePhoto = function() {
    if (!$scope.photo) return; //why is this getting called on initialize?
    var base64 = $scope.photo.split('base64,')[1];
    var parseFile = new Parse.File("photo.jpg", { base64: base64 });
    parseFile.save().then(function() {
      debugger;
      alert('file saved');
      $scope.project.timeline[0].photo = parseFile;
      $scope.$apply();
      $scope.parseProject.attributes = $scope.project;
      $scope.parseProject.save($scope.parseProject);
    }, function(error) {
      alert(error);
    });
  };
  
  // retrieve info
  var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);
  query.equalTo("objectId", steroids.view.params.id);
  query.first({
    success: function(object) {
      $scope.parseProject = object;
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

  $scope.$watch('photo', $scope.savePhoto);


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