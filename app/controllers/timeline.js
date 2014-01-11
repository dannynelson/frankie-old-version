frankieApp.controller('TimelineCtrl', function ($scope, today, navigation) {

  $scope.save = function() {
    localStorage.setItem("timeline", angular.toJson($scope.milestones));
    var msg = { status: 'timelineUpdated' };
    window.postMessage(msg, "*");
    steroids.layers.pop();
  };

  navigation.build(
    'Timeline',
    {title: '/icons/plus.png', action: function() { $scope.$apply($scope.addMilestone()); }},
    {title: '/icons/left.png', action: $scope.save }
  );

  $scope.milestones = JSON.parse(localStorage.getItem('timeline')) || [{ description: "", date: today }];

  $scope.addMilestone = function() {
    $scope.milestones.push({
      description: "",
      date: today
    });
  };


});