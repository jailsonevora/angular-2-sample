angular.module("sgeApp").directive("dialogBox", function () {
    return {

        templateUrl: "views/layout/dialogBox.html",
        scope: {
            dialog: '=',
        }

    };



});