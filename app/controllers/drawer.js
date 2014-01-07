frankieApp.controller('DrawerCtrl', function ($scope) {

  $scope.logout = function() {
    Parse.User.logOut();
    steroids.drawers.hideAll();

    //send message to for index.html to logout
    var msg = { status: "logout" };
    window.postMessage(msg, "*");
  };

});