frankieApp.controller('SettingsCtrl', function ($scope, navigation) {

  navigation.build('Settings');
  var currentUser = Parse.User.current();

  $scope.sendRequest = function() {
    Parse.User.requestPasswordReset(currentUser.getEmail(), {
      success: function() {
        alert("Request Sent");
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    steroids.layers.pop();
  };

  $scope.updateEmail = function(update) {
    if(update.newEmail === update.confirmEmail) {
      currentUser.set("email", update.confirmEmail);
      currentUser.save();
      alert("New email set");
    } else if(update.newEmail !== update.confirmEmail) {
      alert("Emails do not match");
    }
    steroids.layers.pop();
  };

  $scope.update = {};

});