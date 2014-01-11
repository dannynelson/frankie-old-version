frankieApp.controller('ShowCtrl', function ($scope, Project, navigation) {

  $scope.findNextDate = function(milestone) {
    return moment(milestone.date, "YYYY-MM-DD").fromNow();
  };

  $scope.formatStart = function(project) {
    return moment(project.start).format("MMM Do");
  };
  $scope.formatEnd = function(project) {
    return moment(project.end).format("MMM Do");
  };


  $scope.uploadPhoto = function($index) {
    $scope.selectedIdx = $index;
    // debugger;
    // alert('photo uploaded');
    document.getElementById('file').click();
  };

  $scope.toggleCompleted = function($index) {
    $scope.project.timeline[$index].completed = !$scope.project.timeline[$index].completed;
  };

  $scope.returnToProjects = function() {
    localStorage.removeItem('currentProject');
    steroids.layers.pop();
  };

  // When a photo is uploaded, add it to the timeline
  $scope.loadPhoto = function() {
    $scope.project.timeline[$scope.selectedIdx].photoURL = $scope.photo;
    $scope.$appy();
  };
  $scope.$watch('photo', $scope.loadPhoto);

  //why is this getting called on initialize?
  $scope.savePhoto = function() {
    if (!$scope.photo) return; //why is this getting called on initialize?
    var base64 = $scope.photo.split('base64,')[1];
    var parseFile = new Parse.File("photo.jpg", { base64: base64 });
    parseFile.save().then(function() {
      $scope.project.timeline[$scope.selectedIdx].photoURL = parseFile.url();
      $scope.$apply();
      $scope.parseProject.attributes = $scope.project;
      $scope.parseProject.save();
    }, function(error) {
      alert(error);
    });
  };
  
  // retrieve info
  $scope.load = function() {
    Project.getById(steroids.view.params.id, function(object) {
      $scope.parseProject = object;
      $scope.project = object.attributes;
      // Save current project info to localStorage (edit.html gets it from there)
      localStorage.setItem("currentProject", JSON.stringify(object.attributes));
      localStorage.setItem("currentObjectId", steroids.view.params.id);
      $scope.$apply();
      setNavigation();
    });
  };
  $scope.load();

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      // $scope.loadFrankie();
      $scope.load();
      $scope.$apply();
    }
    if (event.data.status === "delete") {
      steroids.layers.pop();
    }
  });


  function setNavigation() {
    // -- Native navigation
    navigation.build(
      $scope.project.title,
      {title: 'Edit', action: '/views/frankie/new.html?id=' + steroids.view.params.id },
      {title: '/icons/left.png', action: $scope.returnToProjects }
    );
  }

});