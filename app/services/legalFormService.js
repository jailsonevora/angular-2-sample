angular.module("sgeApp").factory("LegalFormService", function ($resource, API) {

  return $resource(API.legalForm, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });



});
