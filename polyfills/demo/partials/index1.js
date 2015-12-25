/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-14
 */
angular.module('test1', ['test2'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('index1.entry', {
        url     : '/entry',
        template: '<span>卡卡西 我爱罗</span>'
      });

  })

  .run(function () {

    console.log('test1 loaded');

  });