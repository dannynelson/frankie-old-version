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