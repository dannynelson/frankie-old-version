// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where angular is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
}


var module = angular.module('FrankieModel', ['restangular']);

module.factory('FrankieRestangular', function(Restangular) {

  // window.setTimeout(function() {
  //   alert("Good! Now configure app/models/frankie.js");
  // }, 2000);

  return Restangular.withConfig(function(RestangularConfigurer) {

// -- Stackmob REST API configuration

   RestangularConfigurer.setBaseUrl('http://api.stackmob.com');
   // RestangularConfigurer.setRestangularFields({
   //   id: "frankie_id"
   // });

   RestangularConfigurer.setDefaultHeaders({
    'Accept': 'application/vnd.stackmob+json; version=0',
    // why is it written this way??
    'X-StackMob-API-Key-472f5af2-9879-4b31-9374-169d193d1e3f': '1'
    // 'X-StackMob-API-Key': '472f5af2-9879-4b31-9374-169d193d1e3f'

   });

  });

});


})();
