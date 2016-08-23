/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-11
 * 基于ui-router & oclazeload实现的按需加载方案,可在不修改一行js代码的情况下实现angular框架的按需加载
 * 依赖于 oclazeload
 */
;(function (angular, undefined) {

	'use strict';

	angular
		.module('ui.router.requirePolyfill', ['ng', 'ui.router', 'oc.lazyLoad'])
		.decorator('uiViewDirective', DecoratorConstructor);

	/**
	 * 装饰uiView指令,给其加入按需加载的能力
	 */
	DecoratorConstructor.$inject = ['$delegate', '$log', '$q', '$compile', '$controller', '$interpolate', '$state', '$ocLazyLoad'];
	function DecoratorConstructor($delegate, $log, $q, $compile, $controller, $interpolate, $state, $ocLazyLoad) {

		// 移除原始指令逻辑
		$delegate.pop();
		// 在原始ui-router的模版加载逻辑中加入脚本请求代码,实现按需加载需求
		$delegate.push({

			restrict: 'ECA',
			priority: -400,
			compile: function (tElement) {
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
						loadScripts(processResult.scripts).then(compileTemplate);
					} else {
						compileTemplate();
					}

				};
			}

		});

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
		 * @return tpl:处理后的模版字符串 scripts:提取出来的脚本链接,数组索引对应脚本优先级, 数据结构: [['a.js','b.js'], ['c.js']]
		 */
		function processTpl(tpl) {

			var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/gi,
				SCRIPT_SRC_REGEX = /.*\ssrc=("|')(\S+)\1.*/,
				SCRIPT_SEQ_REGEX = /.*\sseq=("|')(\S+)\1.*/,
				scripts = [];

			// 处理模版,将script抽取出来
			tpl = tpl.replace(SCRIPT_TAG_REGEX, function (match) {

				// 抽取src部分按设置的优先级存入数组,默认优先级为0(最高优先级)
				var matchedScriptSeq = match.match(SCRIPT_SEQ_REGEX),
					matchedScriptSrc = match.match(SCRIPT_SRC_REGEX);

				var seq = (matchedScriptSeq && matchedScriptSeq[2]) || 0;
				scripts[seq] = scripts[seq] || [];

				if (matchedScriptSrc && matchedScriptSrc[2]) {
					scripts[seq].push(matchedScriptSrc[2]);
				}

				return '<!-- script replaced -->';
			});

			return {
				tpl: tpl,
				scripts: scripts.filter(function (script) {
					// 过滤空的索引
					return !!script;
				})
			};

		}

		// 按脚本优先级加载脚本
		function loadScripts(scripts) {

			var promise = $ocLazyLoad.load(scripts.shift()),
				errorHandle = function (err) {
					$log.error(err);
					return $q.reject(err);
				},
				nextGroup;

			while (scripts.length) {

				nextGroup = scripts.shift();

				promise = promise.then(function (nextGroup) {
					return $ocLazyLoad.load(nextGroup);
				}.bind(null, nextGroup));
			}

			return promise.catch(errorHandle);
		}

	}

})(window.angular);
