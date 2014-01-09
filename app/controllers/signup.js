frankieApp.controller('SignupCtrl', function ($scope) {

  // Landing class to add purple background
  document.body.className = "landing";
  
  $scope.close = function() {
    steroids.layers.pop();
  };

  $scope.create = function(credentials) {

    if(!credentials.username && !credentials.password && !credentials.email){
      alert("Enter a username, password, and email");
      return;
    }

    $scope.loading = true;
    var user = new Parse.User();
    user.set(credentials);
    user.signUp(null, {
      success: function(user) {
        alert('account created');
        $scope.close();
      },
      error: function(user, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    $scope.loading = false;

  };

  $scope.frankie = {};

});