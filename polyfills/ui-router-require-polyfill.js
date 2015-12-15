/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-11
 * 基于ui-router & script-loader实现的按需加载方案,可在不修改一行js代码的情况下实现angular框架的按需加载
 * 依赖于 browser-script-loader (https://github.com/kuitos/script-loader)
 */
;(function (angular, ScriptLoader, undefined) {

  'use strict';

  angular
    .module('ui.router.requirePolyfill', ['ng', 'ui.router'])
    .decorator('uiViewDirective', decorator);

  function decorator($delegate) {

    // 获取应用的injector
    var injector = angular.element(document.querySelector('[ng-app]')).injector();

    /**
     * 在原始ui-router的模版加载逻辑中加入脚本请求代码,实现按需加载需求
     */
    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$interpolate', '$state'];
    function $ViewDirectiveFill($compile, $controller, $interpolate, $state) {

      return {

        restrict: 'ECA',
        priority: -400,
        compile : function (tElement) {
          var initial = tElement.html();
          return function (scope, $element, attrs) {

            var current = $state.$current,
              name = getUiViewName(scope, attrs, $element, $interpolate),
              locals = current && current.locals[name];

            if (!locals) {
              return;
            }

            $element.data('$uiView', {name: name, state: locals.$$state});

            var template = locals.$template ? locals.$template : initial,
              processResult = processTpl(template);

            var compileTemplate = function () {
              $element.html(processResult.tpl);

              var link = $compile($element.contents());

              if (locals.$$controller) {
                locals.$scope = scope;
                locals.$element = $element;
                var controller = $controller(locals.$$controller, locals);
                if (locals.$$controllerAs) {
                  scope[locals.$$controllerAs] = controller;
                }
                $element.data('$ngControllerController', controller);
                $element.children().data('$ngControllerController', controller);
              }

              link(scope);
            };

            // 模版中不含脚本则直接编译,否则在获取完脚本之后再做编译
            if (processResult.scripts.length) {
              ScriptLoader.loadAsync.apply(ScriptLoader, processResult.scripts.concat([compileTemplate]));
            } else {
              compileTemplate();
            }

          };
        }

      }

    }

    // 移除原始指令逻辑
    $delegate.pop();
    // 加入复写后的逻辑
    $delegate.push(injector.invoke($ViewDirectiveFill));

    return $delegate;

    /**
     * Shared ui-view code for both directives:
     * Given scope, element, and its attributes, return the view's name
     */
    function getUiViewName(scope, attrs, element, $interpolate) {
      var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
      var inherited = element.inheritedData('$uiView');
      return name.indexOf('@') >= 0 ? name : (name + '@' + (inherited ? inherited.state.name : ''));
    }

    /**
     * 从模版中解析出script外链脚本
     * @return tpl:处理后的模版字符串 scripts:提取出来的脚本链接
     */
    function processTpl(tpl) {

      var SCRIPT_TAG_REGEX = /(<script\s+((?!type=('|")text\/ng-template('|")).)*)|(<script\s*)>.*<\/script>/gi,
        SCRIPT_SRC_REGEX = /.*\ssrc="(.*)".*/,
        scripts = [];

      // 处理模版,将script抽取出来
      tpl = tpl.replace(SCRIPT_TAG_REGEX, function (match) {
        // 抽取src部分脚本存入数组
        scripts.push(match.replace(SCRIPT_SRC_REGEX, "$1"));
        return '<!-- script replaced -->';
      });

      return {
        tpl    : tpl,
        scripts: scripts
      };

    }

  }

})(window.angular, window.ScriptLoader);
