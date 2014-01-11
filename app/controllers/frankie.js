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
    // action can be function or path to push
    var rightButton, leftButton;
    if (right) rightButton = setButton(right.title, right.action);
    if (left) leftButton = setButton(left.title, left.action);
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

  return { build: buildNav };
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
  return { open: openDrawer };
});

frankieApp.factory('Photo', function() {
  return {
    save: function(photoURL, successCallback) {
      var base64 = photoURL.split('base64,')[1];
      var parseFile = new Parse.File("photo.jpg", { base64: base64 });
      parseFile.save().then(successCallback, function(error) {
        alert(error);
      });
    }
  };
});

frankieApp.factory('Project', function() {
    // generate current date
  var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);

  var getAll = function(column, value, successCallback) {
    query.equalTo(column, value);
    query.find({
      success: successCallback,
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  var getFirst = function(column, value, successCallback) {
    query.equalTo(column, value);
    query.first({
      success: successCallback,
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  var getById = function(id, successCallback) {
    query.get(id, {
      success: successCallback,
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  var save = function(projectAttributes, successCallback) {
    var privateProject = new Project();
    privateProject.set(projectAttributes);
    privateProject.set("user", Parse.User.current());
    privateProject.setACL(new Parse.ACL(Parse.User.current()));
    privateProject.save(null, {
      success: successCallback,
      error: function(object, error) {
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  };

  var update = function(parseProject, attributes, successCallback) {
    parseProject.set(attributes);
    parseProject.save(null, {
      success: successCallback,
      error: function(object, error) {
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  };

  return {
    get: getAll,
    getById: getById,
    save: save,
    update: update
  };
});

frankieApp.run(function() {
  Parse.initialize(
    "P2Z0R55WriW7Mi8h6bQqmhlLgGZQxjPe3Vc7PVQx",
    "jvPhmi8qIckRbuv6C1ezzXCMMivYTfJrjjHK5Tcc"
  );
  steroids.view.setBackgroundColor('#000');
  // steroids.view.setBackgroundColor('#2a2f3b');
});
