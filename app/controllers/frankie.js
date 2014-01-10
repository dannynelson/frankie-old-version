var frankieApp = angular.module('frankieApp', ['hmTouchevents']);

frankieApp.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        };
        reader.readAsDataURL(changeEvent.target.files[0]);
      });
    }
  };
}]);

frankieApp.factory('today', function() {
    // generate current date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  today = yyyy+'-'+mm+'-'+dd;
  return today;
});

frankieApp.factory('navigation', function() {
  var rightButton, leftButton;
  var setRight = function(right, rightAction) {
    rightButton = new steroids.buttons.NavigationBarButton();
    if (right.slice(right.length-4) === '.png') {
      rightButton.imagePath = right;
    } else {
      rightButton.title = right;
    }
    rightButton.onTap = rightAction;
  };

  var setLeft = function(left, leftAction) {
    leftButton = new steroids.buttons.NavigationBarButton();
    if (left.slice(left.length-4) === '.png') {
      leftButton.imagePath = left;
    } else {
      leftButton.title = left;
    }
    leftButton.onTap = leftAction;
  };

  var buildNav = function(title, right, left) {
    steroids.view.navigationBar.show(title);
    if (right) setRight(right.title, right.action);
    if (left) setLeft(left.title, left.action);
    if (right && !left) {
      steroids.view.navigationBar.setButtons({
        right: [rightButton]
      });
    } else if (right && left) {
      steroids.view.navigationBar.setButtons({
        left: [leftButton],
        right: [rightButton],
        overrideBackButton: true
      });
    }
  };

  return {
    build: buildNav
  };
});

frankieApp.factory('User', function() {
    // generate current date
  
});

frankieApp.factory('Project', function() {
    // generate current date
  
});

frankieApp.run(function() {
  Parse.initialize(
    "P2Z0R55WriW7Mi8h6bQqmhlLgGZQxjPe3Vc7PVQx",
    "jvPhmi8qIckRbuv6C1ezzXCMMivYTfJrjjHK5Tcc"
  );
  steroids.view.setBackgroundColor('#000')
  // steroids.view.setBackgroundColor('#2a2f3b');
});
