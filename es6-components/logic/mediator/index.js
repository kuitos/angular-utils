/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import angular from 'angular';
import Mediator from './mediator';

export default angular
	.module('ngUtils.mediator', [])
	.service('Mediator', Mediator)
	.name;
