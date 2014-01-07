frankieApp.controller('EditCtrl', function ($scope) {

  $scope.project = JSON.parse(localStorage.getItem("currentProject"));

  //project gets modified by passing into function?
  $scope.update = function(project) {
    // Retrieve Object
    $scope.loading = true;
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    query.get(project.objectId, {
      // update and save if successful
      success: function(object) {
        object.set(project);
        object.save();
        $scope.loading = false;
        steroids.layers.pop();
      },
      error: function(object, error) {
        alert(error);
      }
    });
  };

  $scope.openClientInfo = function() {
    localStorage.setItem("clientInfo", JSON.stringify($scope.project.clientInfo));
    var clientInfoView = new steroids.views.WebView("/views/frankie/update-client.html");
    steroids.layers.push(clientInfoView);
  };

  steroids.view.navigationBar.show('Edit Project');

});