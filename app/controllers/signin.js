frankieApp.controller('SigninCtrl', function ($scope) {

  $scope.init = function() {
    // Landing class to add purple background
    document.body.className = "landing";

    // Navigation Bar
    steroids.view.navigationBar.show();
    var signupButton = new steroids.buttons.NavigationBarButton();
    signupButton.title = "signup";
    signupButton.onTap = function() {
      var signupView = new steroids.views.WebView("/views/frankie/signup.html");
      steroids.layers.push(signupView);
    };
    steroids.view.navigationBar.setButtons({
      right: [signupButton],
      overrideBackButton: true
    });

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

    // can only preload once
    // indexView.preload({},{
    //   onSuccess: function() {
    //     steroids.layers.push(indexView);
    //   }
    // });
    
  };

  $scope.create = function(user) {
    $scope.loading = true;

    Parse.User.logIn(user.username, user.password, {
      success: function(user) {
        $scope.loading = false;

        // // send message to reload data
        // var msg = { status: 'reload' };
        // window.postMessage(msg, "*");

        $scope.showIndexView();
      },
      error: function(user, error) {
        $scope.loading = false;
        alert("Invalid Username or Password");
      }
    });
  };

  $scope.frankie = {};

  // test if user is logged in
  var currentUser = Parse.User.current();
  if (currentUser) {
    $scope.showIndexView();
  }

});