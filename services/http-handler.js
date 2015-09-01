/**
 * @author kui.liu
 * @since 2014/10/10 下午5:52
 * http处理器，用于设定全局http配置，包括loading状态切换，拦截器配置，超时时间配置等
 * 基于rest api可以构建超强http缓存中间件
 */
;
(function (angular, undefined) {
  "use strict";

  // 模拟service的私有服务
  var _app = {};

  angular.module("ngUtils.services.httpHandler", [])

    .config(["$httpProvider", function ($httpProvider) {

      var GET = 'GET',
        /** http请求相关状态(loading,saving)切换 */
        count = 0,
        loading = false,
        saving = false,

        stopLoading = function () {
          loading = false;
          _app.isLoading(false); // end loading
        },
        stopSaving = function () {
          saving = false;
          _app.isSaving(false); // end saving
        };

      /*************************** http超时时间设为30s ***************************/
      $httpProvider.defaults.timeout = 30 * 1000;
      /*************************** 禁用浏览器缓存 ***************************/
      $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
      /* 广告时间哈哈.... */
      $httpProvider.defaults.headers.common["X-Requested-With"] = "https://github.com/kuitos";

      /******************** http拦截器，用于统一处理错误信息、消息缓存、请求响应状态、响应结果处理等 **********************/
      $httpProvider.interceptors.push(["$q", "$log", "$timeout", "$cacheFactory", "tipsHandler",
        function ($q, $log, $timeout, $cacheFactory, tipsHandler) {

          return {

            request: function (config) {

              count++;
              if (!loading) {

                // saving start
                if (config.savingStatus) {
                  saving = true;
                  _app.isSaving(true);
                }

                $timeout(function () {
                  if (!loading && count > 0) {
                    loading = true;
                    _app.isLoading(true);
                  }
                }, 500); // if no response in 500ms, begin loading
              }

              return config;
            },

            requestError: function (rejection) {
              $log.error("%s 接口请求失败!", rejection.url);
              return $q.reject(rejection);
            },

            response: function (res) {
              var config = res.config,
                responseBody = res.data,
                cache;

              count--;
              // 响应结束，清除相关状态
              if (count === 0) {
                stopSaving();
                if (loading) {
                  stopLoading();
                }
              }

              /**
               * 若请求为非查询操作(save,update,delete等更新操作)，成功后需要重新刷新cache(清空对应cache)。默认cache为defaultRestCache
               * 查询请求中含有私有参数_forceRefresh时也需要强制刷新
               */
              if ((config.method !== GET && config.cache) || (config.method === GET && config.params._forceRefresh)) {

                cache = angular.isObject(config.cache) ? config.cache : $cacheFactory.get("defaultRestCache");
                cache.removeAll();

                // 关注保存状态则弹出成功提示
                if (config.savingStatus) {
                  tipsHandler.success(responseBody.message);
                }
              }

              return res;
            },

            responseError: function (rejection) {

              count--;
              // 响应结束，清除相关状态
              if (count === 0) {
                stopSaving();
                if (loading) {
                  stopLoading();
                }
              }

              // 失败弹出错误提示信息
              tipsHandler.error("请求错误!");
              $log.error("接口 %s 请求错误! 状态：%s 错误信息：%s", rejection.config.url, rejection.status, rejection.statusText);
              return $q.reject(rejection);
            }
          }
        }]);
    }])

    /* 提示信息provider，用于配置错误提示处理器 **/
    .provider("tipsHandler", function () {

      var _tipsHandler = {
        error  : angular.noop,
        warning: angular.noop,
        success: angular.noop
      };

      this.setTipsHandler = function (tipsHandler) {
        _tipsHandler = angular.extend(_tipsHandler, tipsHandler);
      };

      this.$get = function () {
        return {
          error  : _tipsHandler.error,
          warning: _tipsHandler.warning,
          success: _tipsHandler.success
        }
      };

    })

    .run(["$rootScope", function ($rootScope) {

      /** loading状态切换 **/
      _app.isLoading = function (flag) {
        $rootScope.loading = flag;
      };

      _app.isSaving = function (flag) {
        $rootScope.saving = flag;
      };

    }]);

})(window.angular);
