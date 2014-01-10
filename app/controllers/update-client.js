frankieApp.controller('UpdateClientCtrl', function ($scope, navigation) {
  
  navigation.build('Update Client');

  $scope.client = JSON.parse(localStorage.getItem("clientInfo"));
  
  $scope.create = function(input) {
    localStorage.setItem("clientInfo", JSON.stringify(input));
    steroids.layers.pop();
  };
});