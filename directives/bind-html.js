/**
 * @author kui.liu
 * @since 2014/12/26 下午5:15
 */
;
(function (angular, undefined) {
    "use strict";

    angular.module("ngUtils.components.bindHtml", [])

        .directive("bindHtml", ["$parse", "$compile", function ($parse, $compile) {

            return {
                restrict: "A",
                link    : function (scope, element, attr) {

                    scope.$watch(function (scope) {
                        return scope.$eval(attr.bindHtml);
                    }, function (newTpl) {
                        element.html(newTpl);
                        $compile(element.contents())(scope);
                    });
                }
            };

        }]);
})(window.angular);