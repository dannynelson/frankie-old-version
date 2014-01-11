frankieApp.controller('ClientCtrl', function ($scope, navigation) {
  
  $scope.create = function(input) {
    localStorage.setItem("clientInfo", JSON.stringify(input));
    var msg = { status: 'clientUpdated' };
    window.postMessage(msg, "*");
    steroids.layers.pop();
  };

  navigation.build(
    'Client Info',
    {title: '', action: function() { $scope.create($scope.client);} } ,
    {title: '/icons/left.png', action: function() {$scope.create($scope.client);} }
  );

  $scope.client = JSON.parse(localStorage.getItem("clientInfo")) || {};


});