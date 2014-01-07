frankieApp.controller('DrawerCtrl', function ($scope) {

  $scope.logout = function() {
    alert('inside logout');
    Parse.User.logOut();
    alert('inside logout 1');

    steroids.drawers.hideAll();
    alert('inside logout 2');

    //send message to for index.html to logout
    var msg = { status: "logout" };
    window.postMessage(msg, "*");
  };

});