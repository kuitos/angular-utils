/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _decoratorsInject = require('../decorators/Inject');

var _decoratorsInject2 = _interopRequireDefault(_decoratorsInject);

var Performance = (function () {
	function Performance($timeout) {
		_classCallCheck(this, _Performance);

		this.$timeout = $timeout;
	}

	/**
  * 函数只会在确定时间延时后才会被触发(只会执行间隔时间内的最后一次调用)
  */

	_createClass(Performance, [{
		key: 'debounce',
		value: function debounce(func, delay, scope, invokeApply) {

			var $timeout = this.$timeout;
			var timer = undefined;

			return function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				var context = scope;

				$timeout.cancel(timer);
				timer = $timeout(function () {

					timer = undefined;
					func.apply(context, args);
				}, delay || 300, invokeApply);
			};
		}

		/**
   * 函数节流。使一个持续性触发的函数执行间隔大于指定时间才会有效(只会执行间隔时间内的第一次调用)
   */
	}, {
		key: 'throttle',
		value: function throttle(func, delay) {
			var context = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

			var recent = undefined;
			return function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var now = Date.now();

				if (!recent || now - recent > (delay || 10)) {
					func.apply(context, args);
					recent = now;
				}
			};
		}
	}]);

	var _Performance = Performance;
	Performance = (0, _decoratorsInject2['default'])('$timeout')(Performance) || Performance;
	return Performance;
})();

exports['default'] = Performance;
module.exports = exports['default'];