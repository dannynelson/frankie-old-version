/**
 * Extends steroids with a preload function that safely pre-loads a view.
 * If the view has already been pre-loaded, it uses that one.
 *
 * @author Kirk Morales (kirk@intrakr.com)
 * @license The MIT License (MIT)
 * @copyright (c) 2013 Kirk Morales
 */


var steroids = (function(s) {

  "use strict";

  /**
   * The error message received when a webview has already been preloaded.
   * @type {string}
   * @const
   * @private
   */
  var ERR_MESSAGE = 'A preloaded layer with this identifier already exists'.toLowerCase();

  /**
   * Preloads a webview. If already preloaded, use that one.
   *
   * @param {steroids.views.WebView} webview [REQUIRED] The webview to preload.
   * @param {string} id [REQUIRED] A unique ID to assign to the preloaded webview.
   * @param {function} onSuccess The function that's called when the webview
   *                              has been preloaded.
   * @param {function} onError The function that's called if preloading fails.
   */
  s.preload = function(webview, id, onSuccess, onError) {

    if (!webview || !id || !(webview instanceof steroids.views.WebView)) return;

    webview.preload({
      id: id
    },{
      onSuccess: function() {
        if (typeof onSuccess == 'function') onSuccess();
      },
      onFailure: function(e) {
        if (e && e.errorDescription && e.errorDescription.toLowerCase() == ERR_MESSAGE) {
          // Replace webview ID with the one that's already preloaded
          webview.id = id;

          if (typeof onSuccess == 'function') onSuccess();
          
        } else if (typeof onError == 'function') {
          onError(e);
        }
      }
    });
  };


  return s;
  
})(window.steroids || {});

