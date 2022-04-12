angular.module("sgeApp").factory("ValidateService", function ($resource, API) {

        return $resource(API.entityValidation);


});