frankieApp.controller('ClientCtrl', function ($scope) {
  steroids.view.navigationBar.show('Client Info');

  $scope.client = JSON.parse(localStorage.getItem("clientInfo")) || {};

  $scope.create = function(input) {
    localStorage.setItem("clientInfo", JSON.stringify(input));
    var msg = { status: 'clientUpdated' };
    window.postMessage(msg, "*");
    steroids.layers.pop();
  };
});