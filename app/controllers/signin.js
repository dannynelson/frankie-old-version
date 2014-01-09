  frankieApp.controller('SigninCtrl', function ($scope) {

  $scope.init = function() {
    // Landing class to add purple background
    document.body.className = "landing";

    // Navigation Bar
    // steroids.view.navigationBar.show();
    // var signupButton = new steroids.buttons.NavigationBarButton();
    // signupButton.title = "signup";
    // signupButton.onTap = function() {
    //   var signupView = new steroids.views.WebView("/views/frankie/signup.html");
    //   steroids.layers.push(signupView);
    // };
    // steroids.view.navigationBar.setButtons({
    //   right: [signupButton],
    //   overrideBackButton: true
    // });

  };
  $scope.init();

  $scope.showSignupView = function() {
    var signupView = new steroids.views.WebView("/views/frankie/signup.html");
    steroids.modal.hide();
    steroids.modal.show(signupView);
  };

  $scope.showIndexView = function() {
    var indexView = new steroids.views.WebView("/views/frankie/index.html");
    steroids.layers.push(indexView);
    
    // indexView.preload({}, {
    //   onSuccess: function() {
    //     steroids.layers.replace(indexView);
    //   }
    // });
  };

  $scope.create = function(user) {
    $scope.loading = true;

    if(!user.username && !user.password) {
      alert("Enter a username & password");
      return;
    }
  
    Parse.User.logIn(user.username, user.password, {
      success: function(user) {
        $scope.showIndexView();
      },
      error: function(user, error) {
        alert("Invalid Username or Password");
      }
    });
    $scope.loading = false;

  };

  $scope.frankie = {};

  // test if user is logged in
  var currentUser = Parse.User.current();
  if (currentUser) {
    $scope.showIndexView();
  }



});