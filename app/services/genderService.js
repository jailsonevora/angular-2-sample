angular.module("sgeApp").factory("GenderService", function ($resource, API) {

  return $resource(API.gender, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });



});
