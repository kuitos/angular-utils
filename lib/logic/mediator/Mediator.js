/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

/**
 * 中介者模式。用于解决各模块间无法通过 $scope.$emit $scope.$on 等方式实现通信的问题(例如兄弟模块间通信)
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Mediator = (function () {
	function Mediator() {
		_classCallCheck(this, Mediator);

		this.topics = {};
	}

	/**
  * 订阅消息
  * @param topic 订阅消息名
  * @param listener 消息发布时触发的回调
  * @param scope 订阅行为发生所在的scope，用于在scope销毁时作解绑操作
  * @returns {Function} 取消订阅的反注册函数
  */

	_createClass(Mediator, [{
		key: 'subscribe',
		value: function subscribe(topic, listener, scope) {

			var topicListeners = this.topics[topic] = this.topics[topic] || [];

			// 可清除指定监听器，如果不传则清除对应topic全部监听器
			function unSubscribe(listener) {

				var listenerIndex = undefined;

				if (!listener) {
					// 清空
					topicListeners.length = 0;
				} else {

					listenerIndex = topicListeners.indexOf(listener);
					if (~listenerIndex) {
						topicListeners.splice(listenerIndex, 1);
					}
				}
			}

			if (scope && scope.constructor === $rootScope.constructor) {
				// scope销毁时同步移除对应订阅行为
				scope.$on('$destroy', unSubscribe.bind(null, listener));
			}

			topicListeners.push(listener);

			return unSubscribe;
		}

		/**
   * 发布消息，支持链式调用
   */
	}, {
		key: 'publish',
		value: function publish() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var topic = args[0],
			    listeners = this.topics[topic] || [],
			    slice = Array.prototype.slice;

			listeners.forEach(function (listener) {

				if (typeof listener === 'function') {
					listener.apply(null, slice.call(args, 1));
				} else {
					console.error("中介者发布 %s 消息失败，注册的listener不是函数类型！", topic);
				}
			});

			return this;
		}
	}]);

	return Mediator;
})();

exports['default'] = Mediator;
module.exports = exports['default'];