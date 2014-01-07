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

frankieApp.run(function() {
  Parse.initialize(
    "P2Z0R55WriW7Mi8h6bQqmhlLgGZQxjPe3Vc7PVQx",
    "jvPhmi8qIckRbuv6C1ezzXCMMivYTfJrjjHK5Tcc"
  );
});
