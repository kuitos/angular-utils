/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-15
 */
;(function () {

  'use strict';

  angular
    .module('test2', ['ui.router.requirePolyfill'])
    .run(function () {
      console.log('test2');
    });

})();