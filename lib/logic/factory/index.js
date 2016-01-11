/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-29
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Factory = (function () {
	function Factory() {
		_classCallCheck(this, Factory);
	}

	_createClass(Factory, null, [{
		key: 'create',
		value: function create(Constructor) {

			function factory() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				var instance = new (_bind.apply(Constructor, [null].concat(args)))();

				if ('link' in instance) {
					instance.link = instance.link.bind(instance);
				}

				return instance;
			}

			factory.$inject = Constructor.$inject || [];

			return factory;
		}
	}]);

	return Factory;
})();

exports['default'] = Factory;
module.exports = exports['default'];