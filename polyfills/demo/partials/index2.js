/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-15
 */
;(function () {

  'use strict';

  angular
    .module('test2', [])

    .config(function ($stateProvider) {

      $stateProvider
        .state('index2.entry', {

          url: '/entry',
          template: '<span>第一王权者 第三王权者</span>'

        });

    })

    .run(function () {
      console.log('test2');
    });

})();