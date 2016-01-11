/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import Inject from '../decorators/Inject';

@Inject('$timeout')
export default class Performance {

	constructor($timeout) {
		this.$timeout = $timeout;
	}

	/**
	 * 函数只会在确定时间延时后才会被触发(只会执行间隔时间内的最后一次调用)
	 */
	debounce(func, delay, scope, invokeApply) {

		const $timeout = this.$timeout;
		let timer;

		return (...args) => {
			const context = scope;

			$timeout.cancel(timer);
			timer = $timeout(() => {

				timer = undefined;
				func.apply(context, args);

			}, delay || 300, invokeApply);
		};
	}

	/**
	 * 函数节流。使一个持续性触发的函数执行间隔大于指定时间才会有效(只会执行间隔时间内的第一次调用)
	 */
	throttle(func, delay, context = null) {
		let recent;
		return (...args) => {
			const now = Date.now();

			if (!recent || (now - recent > (delay || 10))) {
				func.apply(context, args);
				recent = now;
			}
		};
	}

}
