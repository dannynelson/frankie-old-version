frankieApp.controller('SettingsCtrl', function ($scope) {

  steroids.view.navigationBar.show('Settings');

  var currentUser = Parse.User.current();
  $scope.currentUser = currentUser;

  $scope.update = function(updatedCredentials) {
    currentUser.requestPasswordReset(currentUser.getEmail());
    alert(currentUser.getEmail());
  };
  
  $scope.updateUser = {};

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