angular.module("sgeApp").directive("tableStatic", function () {
    return {

        templateUrl: "views/layout/tableStatic.html",
        scope: {
            models: '=',
            tab: '=',
            contextUtils: '=',
            labels: '='
        }

    };



});