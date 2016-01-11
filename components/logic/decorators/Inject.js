/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

/**
 * angular依赖注入器
 */
export default function Inject(...dependencies) {

	return (target, ket, descriptor) => {

		if (descriptor) {
			const fn = descriptor.value;
			fn.$inject = dependencies;
		} else {
			target.$inject = dependencies;
		}
	}

}
