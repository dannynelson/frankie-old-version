frankieApp.controller('SigninCtrl', function ($scope, navigation) {

  $scope.showIndexView = function() {
    var indexView = new steroids.views.WebView("/views/frankie/index.html");
    steroids.layers.push(indexView);
  };

  $scope.init = function() {
    // test if user is logged in
    var currentUser = Parse.User.current();
    if (currentUser) $scope.showIndexView();

    // Landing class to add purple background
    document.body.className = "landing";

    // Build NavBar
    navigation.build('', {title: 'Signup', action: "/views/frankie/signup.html"});
  };
  $scope.init();

  $scope.showSignupView = function() {
    var signupView = new steroids.views.WebView("/views/frankie/signup.html");
    steroids.modal.hide();
    steroids.modal.show(signupView);
  };

  $scope.create = function(user) {
    $scope.loading = true;
    if(!$scope.frankie.username && !$scope.frankie.password) {
      alert("Enter a username & password");
      $scope.loading = false;
      return;
    }
    Parse.User.logIn(user.username, user.password, {
      success: function(user) {
        $scope.loading = false;
        $scope.showIndexView();
      },
      error: function(user, error) {
        $scope.loading = false;
        alert("Invalid Username or Password");
      }
    });
  };



});