frankieApp.controller('ClientCtrl', function ($scope) {
  steroids.view.navigationBar.show('Client Info');

  $scope.create = function(input) {
    // var Client = Parse.Object.extend("Client");
    // var client = new Client();
    // client.set("firstName", input.firstName);
    // client.set("lastName", input.lastName);
    // client.set("phone", input.phone);
    // client.set("email", input.email);

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