angular.module("sgeApp").factory("AccountingService", function ($resource, API) {

  return $resource(API.accounting, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });

});
