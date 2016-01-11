/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-29
 */

export default class Factory {

	static create(Constructor) {

		function factory(...args) {

			const instance = new Constructor(...args);

			if ('link' in instance) {
				instance.link = instance.link.bind(instance);
			}

			return instance;
		}

		factory.$inject = Constructor.$inject || [];

		return factory;

	}

}
