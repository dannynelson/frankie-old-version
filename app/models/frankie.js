// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where angular is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
}


var module = angular.module('FrankieModel', ['restangular']);

module.factory('FrankieRestangular', function(Restangular) {

  return Restangular.withConfig(function(RestangularConfigurer) {

// -- Stackmob REST API configuration

   // RestangularConfigurer.setBaseUrl('http://api.stackmob.com');
   // // RestangularConfigurer.setRestangularFields({
   // //   id: "frankie_id"
   // // });

   // RestangularConfigurer.setDefaultHeaders({
   //  'Accept': 'application/vnd.stackmob+json; version=0',
   //  // why is it written this way??
   //  'X-StackMob-API-Key-472f5af2-9879-4b31-9374-169d193d1e3f': '1'
   //  // 'X-StackMob-API-Key': '472f5af2-9879-4b31-9374-169d193d1e3f'

   // });

  RestangularConfigurer.setBaseUrl('https://api.parse.com/1');

  RestangularConfigurer.setDefaultHeaders({
    'Accept': 'application/vnd.stackmob+json; version=0',
    // why is it written this way??
    P2Z0R55WriW7Mi8h6bQqmhlLgGZQxjPe3Vc7PVQx
    XeVNDBn5qNQRmMD1G6A4PcWpk9sigMtYXVFXFjLB
    // why is it written this way??
    'X-StackMob-API-Key-472f5af2-9879-4b31-9374-169d193d1e3f': '1'
    // 'X-StackMob-API-Key': '472f5af2-9879-4b31-9374-169d193d1e3f'

   });
    'X-StackMob-API-Key-472f5af2-9879-4b31-9374-169d193d1e3f': '1'
    // 'X-StackMob-API-Key': '472f5af2-9879-4b31-9374-169d193d1e3f'

   });

  });

});

module.factory('FrankieLogin', function(Restangular) {

  return Restangular.withConfig(function(RestangularConfigurer) {

// -- Stackmob REST API configuration

   RestangularConfigurer.setBaseUrl('http://api.stackmob.com');
   // RestangularConfigurer.setRestangularFields({
   //   id: "frankie_id"
   // });

   RestangularConfigurer.setDefaultHeaders({
    'Accept': 'application/vnd.stackmob+json; version=0',
    'Content-Type':'application/x-www-form-urlencoded',
    // why is it written this way??
    'X-StackMob-API-Key-472f5af2-9879-4b31-9374-169d193d1e3f': '1'
    // 'X-StackMob-API-Key': '472f5af2-9879-4b31-9374-169d193d1e3f'
    // 'X-StackMob-User-Agent':

   });

  });

});


})();
