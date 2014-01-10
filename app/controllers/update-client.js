frankieApp.controller('UpdateClientCtrl', function ($scope, navigation) {
  
  navigation.build('Update Client');

  $scope.client = JSON.parse(localStorage.getItem("clientInfo"));
  
  $scope.create = function(input) {

    var client = {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email
    };

    localStorage.setItem("clientInfo", JSON.stringify(client));

    steroids.layers.pop();
  };
});