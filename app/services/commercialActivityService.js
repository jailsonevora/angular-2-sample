angular.module("sgeApp").factory("CommercialActivityService", function ($resource, API) {

  return $resource(API.commercialActivity, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });



});
