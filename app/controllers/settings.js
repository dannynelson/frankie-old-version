frankieApp.controller('SettingsCtrl', function ($scope) {

  $scope.action = function() {
    alert("ACTION");
    // var currentUser = Parse.User.current();
    // alert(currentUser.username);
  };

  // $scope.close = function() {
  //   steroids.layers.pop();
  // };

  // $scope.create = function(credentials) {
  //   $scope.loading = true;

  //   var user = new Parse.User();
  //   user.set(credentials);
     
  //   user.signUp(null, {
  //     success: function(user) {
  //       $scope.loading = false;
  //       alert('account created');
  //       $scope.close();
  //     },
  //     error: function(user, error) {
  //       $scope.loading = false;
  //       alert("Error: " + error.code + " " + error.message);
  //     }
  //   });
  // };

  // $scope.frankie = {};

});