/**
 * @author Kuitos
 * @since 15/5/14.
 * @version 1.0.0
 * 动态 添加/删除 元素属性，如果是angular支持的事件(如ngClick)则同时对元素做 绑定/解绑 事件切换
 */
;
(function (angular, undefined) {
    "use strict";

    angular.module("ngUtils.components.dynamicAttr", [])

        .directive("dynamicAttr", ["$parse", function ($parse) {

            return {
                restrict: "A",
                compile : function (element) {

                    // 原始angular支持的事件集合
                    var EVENTS = "click dblclick".split(" ");

                    // 从元素上收集到的事件属性
                    var collectedEventAttributes = [],
                        collectedAttrEventMapper = {};

                    // 收集当前元素的原始事件(ng-click等)
                    EVENTS.forEach(function (eventName) {

                        var attrName = "ng-" + eventName,
                            attrValue = element.attr(attrName);

                        // 如果绑定存在
                        if (attrValue && (attrValue = attrValue.trim())) {

                            collectedAttrEventMapper[attrName] = {
                                eventName : eventName,
                                expression: attrValue,
                                fn        : $parse(attrValue, null, true)
                            };

                            collectedEventAttributes.push(attrName);
                        }

                    });

                    return function postLink(scope, element, attr) {
                        // 因为监听的是一个对象类型，所以这里watch的时候必须是true(调用angular.equals()对比而不是简单的===，简单的===可能会引发TTL负载异常)
                        scope.$watch(attr.dynamicAttr, function dynamicAttrAction(attributes) {

                            if (attributes !== undefined) {

                                angular.forEach(attributes, function (value, attribute) {

                                    var originalAttrInfo = collectedAttrEventMapper[attribute];

                                    // 如果属性为已收集到的angular事件类型
                                    if (~collectedEventAttributes.indexOf(attribute)) {

                                        if (value) {

                                            // 如果当前元素上不存在该事件属性但是其原始事件属性存在(表明元素之前做过disable切换)，则重新绑定事件回调
                                            if (!element.attr(attribute) && originalAttrInfo) {

                                                element.removeClass(attribute + "-disabled").attr(attribute, originalAttrInfo.expression);

                                                /**
                                                 * rebind event callback
                                                 * @see ngClick
                                                 */
                                                element.bind(originalAttrInfo.eventName, function (event) {
                                                    scope.$apply(function () {
                                                        originalAttrInfo.fn(scope, {$event: event});
                                                    });
                                                });
                                            }

                                        } else {

                                            // 状态为false时加入样式并移除对应事件回调
                                            element.addClass(attribute + "-disabled").removeAttr(attribute).unbind(originalAttrInfo.eventName);
                                        }

                                    } else {

                                        attr.$set(attribute, value ? "" : null);
                                    }

                                });
                            }
                        }, true);

                        // unbind events for performance
                        scope.$on("$destroy", function unbindEvents() {
                            angular.forEach(collectedAttrEventMapper, function (eventInfo) {
                                element.unbind(eventInfo.eventName);
                            });

                        });
                    }
                }
            };

        }]);

})(window.angular);