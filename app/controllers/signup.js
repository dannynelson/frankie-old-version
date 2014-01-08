frankieApp.controller('SignupCtrl', function ($scope) {

  // Landing class to add purple background
  document.body.className = "landing";
  
  $scope.close = function() {
    steroids.layers.pop();
  };

  $scope.create = function(credentials) {
    $scope.loading = true;
    var user = new Parse.User();
    user.set(credentials);
    user.signUp(null, {
      success: function(user) {
        $scope.loading = false;
        alert('account created');
        $scope.close();
      },
      error: function(user, error) {
        $scope.loading = false;
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  $scope.frankie = {};

});