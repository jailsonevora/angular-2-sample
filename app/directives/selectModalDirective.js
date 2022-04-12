angular.module("sgeApp").directive("selectModal", function () {
    return {

        templateUrl: "views/layout/selectModal.html",
        scope: {
            modal: '=',
            utilsFn: '=',
        }

    };



});