frankieApp.controller('ClientCtrl', function ($scope) {
  steroids.view.navigationBar.show('Client Info');

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