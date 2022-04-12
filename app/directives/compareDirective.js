angular.module("sgeApp").directive("compare", function () {
    return {

        templateUrl: function(el, attrs) {
            return attrs.templateUrl;
        },
        scope: {
            entity: '=',
            display: '='
        }

    };



});