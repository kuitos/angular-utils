/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-21
 */
;
(function (angular, undefined) {

  'use strict';

  // 性能工具
  var PerformanceUtils = {

    /**
     * 函数只会在确定时间延时后才会被触发
     */
    debounce: function (func, delay, scope, invokeApply) {
      var $timeout = _service.$timeout,
        timer;

      return function debounced() {
        var context = scope,
          args = arguments;

        $timeout.cancel(timer);
        timer = $timeout(function () {

          timer = undefined;
          func.apply(context, args);

        }, delay || 300, invokeApply);
      };
    },

    /**
     * 函数节流。使一个持续性触发的函数执行间隔大于指定时间才会有效
     */
    throttle: function throttle(func, delay, context) {
      var recent;
      return function throttled() {
        var context = context || null,
          now = Date.now();

        if (!recent || (now - recent > (delay || 10))) {
          func.apply(context, arguments);
          recent = now;
        }
      };
    }
  };

  angular
    .module('ngUtils.utils.baseUtils', [])
    .constant('baseUtils', {
      PerformanceUtils: PerformanceUtils
    });

})(window.angular);

