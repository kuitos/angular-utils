/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import angular from 'angular';
import Performance from './Performance';

export default angular
	.module('ngUtils.performance', [])
	.service('Performance', Performance)
	.name;


