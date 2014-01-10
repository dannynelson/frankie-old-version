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

  var setButton = function(title, action) {
    button = new steroids.buttons.NavigationBarButton();
    if (title.slice(title.length-4) === '.png') {
      button.imagePath = title;
    } else {
      button.title = title;
    }
    button.onTap = function() {
      // if it is a url string, push it to the layer stack
      if (typeof(action) === 'string') {
        var newView = new steroids.views.WebView(action);
        steroids.layers.push(newView);
      // otherwise, execute the action
      } else {
        action();
      }
    };
    return button;
  };

  // expects right.title and right.pagePath, left.title and left.action
  var buildNav = function(title, right, left) {
    steroids.view.navigationBar.show(title);
    // action can be function or url to push
    if (right) {
      var rightButton = setButton(right.title, right.action);
    }
    if (left) {
      var leftButton = setButton(left.title, left.action);
    }
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

frankieApp.factory('drawer', function() {
  var leftDrawer = new steroids.views.WebView("/views/frankie/drawer.html");
  var leftDrawerShowing = false;
  leftDrawer.preload();
  var openDrawer = function() {
    if (!leftDrawerShowing) {
      leftDrawerShowing = true;
      steroids.drawers.show(leftDrawer);
    } else {
      leftDrawerShowing = false;
      steroids.drawers.hide();
    }
  };
  return {
    open: openDrawer
  }
});

frankieApp.factory('open', function() {
    // generate current date
  
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
