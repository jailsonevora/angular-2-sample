angular.module("sgeApp").factory("CompanyConditionService", function ($resource, API) {

  return $resource(API.entityCondition, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });


});
