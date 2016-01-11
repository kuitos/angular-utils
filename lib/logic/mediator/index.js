/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _Mediator = require('./Mediator');

var _Mediator2 = _interopRequireDefault(_Mediator);

exports['default'] = _angular2['default'].module('ngUtils.mediator', []).service('Mediator', _Mediator2['default']).name;
module.exports = exports['default'];