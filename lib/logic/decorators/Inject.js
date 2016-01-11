/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

/**
 * angular依赖注入器
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = Inject;

function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (target, ket, descriptor) {

		if (descriptor) {
			var fn = descriptor.value;
			fn.$inject = dependencies;
		} else {
			target.$inject = dependencies;
		}
	};
}

module.exports = exports["default"];