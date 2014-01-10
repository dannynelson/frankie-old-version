frankieApp.controller('DrawerCtrl', function ($scope) {
  document.body.className = "drawer";

  $scope.calendar = function() {
    var calendar = new steroids.views.WebView("/views/frankie/calendar.html");
    steroids.layers.push(calendar);
    steroids.drawers.hideAll();
  };

  $scope.logout = function() {
    Parse.User.logOut();
    steroids.drawers.hideAll();
    //send message to for index.html to logout
    var msg = { status: "logout" };
    window.postMessage(msg, "*");
  };

  $scope.settings = function() {
    var settings = new steroids.views.WebView("/views/frankie/settings.html");
    steroids.layers.push(settings);
    steroids.drawers.hideAll();
  };

});