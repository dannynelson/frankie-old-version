frankieApp.controller('EditCtrl', function ($scope, navigation) {

  $scope.init = function() {
    $scope.project = JSON.parse(localStorage.getItem("currentProject"));
    navigation.build(
      'Edit Project',
      { title: 'Delete', action: $scope.delete }
    );
  };
  $scope.init();

  //project gets modified by passing into function?
  $scope.update = function(project) {
    // Retrieve Object
    if (!project.title) {
      alert ('Please enter a title');
      return;
    }
    $scope.loading = true;
    var currentProject = JSON.parse(localStorage.getItem("currentProject"));
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    var title = currentProject.title;
    query.equalTo("title", title);
    query.first({
      // update and save if successful
      success: function(myObject) {
        Parse.Promise.when(myObject)
          .then(function(result){

            for (var key in project) {
              if ( !!(key !== 'user' && key !== 'ACL') ) {
                result.set(key, project[key]);
              }
            }

            result.save(null, {
              success: function(obj) {
                alert('save success');
                // $scope.loading = false;
                var msg = { status: 'reload' };
                window.postMessage(msg, "*");
                localStorage.setItem("currentProject", JSON.stringify(obj));
                // steroids.layers.pop();
              },
              error: function(obj, error) {
                alert('save error');
              }
            });
            $scope.loading = false;
            steroids.layers.pop();

          }, function(error){
            alert('promise error');
          });
      },
      error: function(object, error) {
        alert('query error');
      }
    });
  };

  $scope.openClientInfo = function() {
    localStorage.setItem("clientInfo", JSON.stringify($scope.project.clientInfo));
    var clientInfoView = new steroids.views.WebView("/views/frankie/update-client.html");
    steroids.layers.push(clientInfoView);
  };

  $scope.delete = function() {
    var Project = Parse.Object.extend("Project");
    var query = new Parse.Query(Project);
    var title = $scope.project.title;
    query.equalTo("title", title);
    query.first({
      success: function(myObject) {
        Parse.Promise.when(myObject)
          .then(function(result){
            result.destroy({});
            alert('Project Deleted');

            var newIndexView = new steroids.views.WebView("/views/frankie/index.html");
            steroids.layers.push({
              view: newIndexView,
              navigationBar: false
            });

          }, function(error){
            alert('promise error');
          });
      },
      error: function(myObject, error) {
        alert('query error');
      }
    });
  };

});