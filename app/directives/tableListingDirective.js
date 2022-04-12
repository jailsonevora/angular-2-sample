angular.module("sgeApp").directive("tableListing", function () {
    return {

        templateUrl: "views/layout/tableListing.html",
        scope: {
            models: '=',
            structure: '=',
            actionsFn: '=',
            labels: '=',
            labelsModels: '=',
            buttonsFn: '=',
            bulkSelect: '=',
            searchFilters: '=',
            singleSearch: '=',
            utilsFn: '=',
            pagination: '='
        }

    };

});
