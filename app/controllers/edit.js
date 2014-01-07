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

  var deleteButton = new steroids.buttons.NavigationBarButton();
  deleteButton.title = "Delete";

  deleteButton.onTap = function() {
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    var title = $scope.project.title;
    query.equalTo("title", title);
    query.find({
      success: function(myObject) {
        Parse.Promise.when(myObject)
          .then(function(result){
            result.destroy({});
            alert('Project Deleted');
            // var reloadMsg = { status: 'reload' };
            // window.postMessage(reloadMsg, "*");
            // steroids.layers.pop();
            var newIndexView = new steroids.views.WebView("/views/frankie/index.html");
            steroids.layers.push({
              view: newIndexView,
              navigationBar: false
            });

            // var newIndexView = new steroids.views.WebView("/views/frankie/index.html");
            // newIndexView.preload({},{
            //   onSuccess: function() {
            //     steroids.layers.replace(newIndexView);
            //   }
            // });

          }, function(error){
            alert('promise error');
          });
      },
      error: function(myObject, error) {
        alert('query error');
      }
    });
  };

  steroids.view.navigationBar.setButtons({
    right: [deleteButton]
  });

});