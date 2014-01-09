frankieApp.controller('TimelineCtrl', function ($scope, today) {

  $scope.milestones = [{
    description: "",
    date: today
  }];

  $scope.addMilestone = function() {
    $scope.milestones.push({
      description: "",
      date: today
    });
  };

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
    localStorage.setItem("timeline", angular.toJson($scope.milestones));
    var msg = { status: 'timelineUpdated' };
    window.postMessage(msg, "*");
    steroids.layers.pop();
  };
});