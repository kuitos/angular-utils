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

    .config(["$httpProvider", 'httpHandlerBlacklist', function ($httpProvider, httpHandlerBlacklist) {

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

      function isInHttpBlackList(url) {

        return httpHandlerBlacklist.some(function (blackUrl) {
          return url.test(blackUrl);
        });

      }

      /*************************** http超时时间设为30s ***************************/
      $httpProvider.defaults.timeout = 30 * 1000;
      /*************************** 禁用浏览器缓存 ***************************/
      $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
      /* 广告时间哈哈.... */
      $httpProvider.defaults.headers.common["X-Requested-With"] = "https://github.com/kuitos";

      /******************** http拦截器，用于统一处理错误信息、消息缓存、请求响应状态、响应结果处理等 **********************/
      $httpProvider.interceptors.push(["$q", "$log", "$timeout", "$cacheFactory", '$injector',
        function ($q, $log, $timeout, $cacheFactory, $injector) {

          return {

            request: function (config) {

              // 不在黑名单中的url才进拦截器
              if (!isInHttpBlackList(config.url)) {

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

              if (!isInHttpBlackList(config.url)) {

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
                if ((config.method !== GET && config.cache) || (config.method === GET && config.params && config.params._forceRefresh)) {

                  cache = angular.isObject(config.cache) ? config.cache : $cacheFactory.get("defaultRestCache");
                  cache.removeAll();

                  // 关注保存状态则弹出成功提示
                  if (config.savingStatus) {
                    $injector.get('tipsHandler').success(responseBody.message);
                  }
                }
              }

              return res;
            },

            responseError: function (rejection) {

              var config = rejection.config;

              if (!isInHttpBlackList(config.url)) {

                count--;
                // 响应结束，清除相关状态
                if (count === 0) {
                  stopSaving();
                  if (loading) {
                    stopLoading();
                  }
                }

                // 失败弹出错误提示信息
                $injector.get('tipsHandler').error(rejection.data || "请求错误!");
                $log.error("接口 %s 请求错误! 状态：%s 错误信息：%s", config.url, rejection.status, rejection.statusText);
              }

              return $q.reject(rejection);
            }
          }
        }]);
    }])

    /* http处理器黑名单列表(该列表中的url不走httpHandler拦截器) */
    .constant('httpHandlerBlacklist', [])

    /* 提示信息provider，用于配置错误提示处理器 **/
    .provider("tipsHandler", function () {

      var _tipsHandler = {
          error  : angular.noop,
          warning: angular.noop,
          success: angular.noop
        },

        _configuredTipsHandler;

      /**
       * 设置具体的tips处理器
       * @param tipsHandler {String|Object} String:service string Object:handler instance
       */
      this.setTipsHandler = function (tipsHandler) {
        _configuredTipsHandler = tipsHandler;
      };

      this.$get = ['$injector', '$log', function ($injector, $log) {

        var verifiedTipsHandler;

        if (angular.isString(_configuredTipsHandler)) {

          try {
            verifiedTipsHandler = $injector.get(_configuredTipsHandler);
          } catch (err) {
            $log.error('%s服务未被正常初始化', _configuredTipsHandler);
          }

        } else if (angular.isObject(_configuredTipsHandler)) {
          verifiedTipsHandler = _configuredTipsHandler;
        }

        return angular.extend(_tipsHandler, verifiedTipsHandler);
      }];

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
