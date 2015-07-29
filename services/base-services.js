/**
 * @author Kuitos
 * @since 2014/10/09 上午10:18
 */
;
(function (angular) {
  "use strict";

  angular.module("ngUtils.services.baseServices", ["ngResource"])

    /* ******************************** constants & values ******************************** */
    // 定义app
    .constant("app", {
      /**
       * 应用根目录 /src:开发环境 /dist:生产环境
       */
      fileRoot: window.ResourceDir,

      /**
       * 指令的模板根目录
       */
      componentsDir: (window.ResourceDir || "src") + "/common/components/",

      /**
       * controller间共享的数据
       */
      SharedDataBetweenCtrls: {},

      /**
       * 下面三个方法（genMembers,bindEvents,kickStart）用于划分scope代码块，不同区块代表不同逻辑，从而改善controller的表现形式
       */
      // 初始化scope成员
      genMembers: function (scope, members) {

        angular.forEach(members, function (value, key) {
          scope[key] = value;
        });

        return this;
      },

      // 绑定事件处理器，避免$scope上绑定过多function， events：原始事件处理function集合
      bindEvents: function (scope, events) {

        var slice = Array.prototype.slice;
        scope.emitEvent = function (eventName) {
          return events[eventName].apply(scope, slice.call(arguments, 1));
        };

        return this;
      },

      // 入口函数
      kickStart: function (initFn) {
        initFn();
      }
    })

    /* ******************************** providers ******************************** */
    .provider("getFile", ["app", function (app) {
      this.html = function (fileName) {
        return app.fileRoot + "/app/" + fileName;
      };
      this.$get = function () {
        return {
          html: this.html
        };
      };
    }])

    /* ******************************** factories ******************************** */
    // 中介者模式。用于解决各模块间无法通过 $scope.$emit $scope.$on 等方式实现通信的问题(例如兄弟模块间通信)
    .factory("Mediator", ["$log", function ($log) {

      var topics = {};

      return {

        /**
         * 订阅消息
         * @param topic 订阅消息名
         * @param listener 消息发布时触发的回调
         * @returns {Function} 取消订阅的反注册函数
         */
        subscribe: function (topic, listener) {

          var topicListeners = topics[topic] = topics[topic] || [];

          topicListeners.push(listener);

          // 可清除指定监听器，如果不传则清除全部监听器
          return function unsubscribe(listener) {

            var listenerIndex;

            if (!listener) {
              topicListeners.length = 0;
            } else {

              listenerIndex = topicListeners.indexOf(listener);
              if (~listenerIndex) {
                topicListeners.splice(listenerIndex, 1);
              }
            }
          }
        },

        /**
         * 发布消息，支持链式调用
         * @param topic
         */
        publish: function (topic) {

          var args = arguments,
            listeners = topics[topic] || [],
            slice = Array.prototype.slice;

          listeners.forEach(function (listener) {

            if (angular.isFunction(listener)) {
              listener.apply(null, slice.call(args, 1));
            } else {
              $log.error("中介者发布 %s 消息失败，注册的listener不是函数类型！", topic);
            }
          });

          return this;
        }
      };
    }])

    // rest接口默认cache
    .factory("defaultRestCache", ["$cacheFactory", function ($cacheFactory) {

      return $cacheFactory("defaultRestCache", {capacity: 50});

    }])

    // 生成resource
    .factory("genResource", ["$resource", "defaultRestCache", function ($resource, defaultRestCache) {

      /**
       *  @url resource url
       *  @cache 外部cache，默认为$http cache
       *  @params additionalActions 额外添加的resource action
       *  @example 使用方式(在自己的app中定义Resources服务)
       <example>
       .factory("Resources", ["$cacheFactory", "genResource", function ($cacheFactory, genResource) {
                return {
                    // 项目resource
                    Project: genResource("/projects/:projectId/", $cacheFactory("project", {capacity: 5}))
                };
             }])
       </example>
       */
      return function (url, cache, params, additionalActions) {

        // 默认cache为defaultRestCache
        // 自定义配置(配合$http interceptor) saveStatus:该操作将维护一个保存状态  refreshCache:该操作后下次请求数据需要刷新cache
        var restHttpCache = cache || defaultRestCache,

          DEFAULT_ACTIONS = {
            // 查询，结果为对象
            "get"   : {method: "GET", cache: restHttpCache},
            // 查询，结果为数组
            "query" : {method: "GET", isArray: true, cache: restHttpCache},
            // 保存(新增)
            "save"  : {method: "POST", refreshCache: true, savingStatus: true, cache: restHttpCache},
            // 保存(修改)
            "update": {method: "PUT", refreshCache: true, savingStatus: true, cache: restHttpCache},
            // 逻辑删除
            "remove": {method: "DELETE", refreshCache: true, savingStatus: true, cache: restHttpCache},
            // 物理删除
            "delete": {method: "DELETE", refreshCache: true, savingStatus: true, cache: restHttpCache}
          };

        return $resource(url, params, angular.extend(DEFAULT_ACTIONS, additionalActions));
      };
    }])

    /* ******************************** services config ******************************** */
    .config(["$resourceProvider", function ($resourceProvider) {

      /** ***************** $resource配置 ****************** **/
      $resourceProvider.defaults.stripTrailingSlashes = false;  // 强制区分restful请求url的/分隔符
    }])

    /* ******************************** services init ******************************** */
    .run(["genResource", "Mediator", "app", function (genResource, Mediator, app) {
      app.genResource = genResource;
      app.Mediator = Mediator;
    }]);

})(window.angular);
