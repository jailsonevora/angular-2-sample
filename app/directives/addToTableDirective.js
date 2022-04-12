angular.module("sgeApp").directive("addToTable", function () {
    return {

        templateUrl: "views/layout/addToTable.html",
        scope: {
            models: '=',
            addFn: '&',
            actionsFn: '=',
            labels: '='
        }

    };



});