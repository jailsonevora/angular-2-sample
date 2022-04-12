angular.module("sgeApp").factory("EconomicSectorService", function ($resource, API) {

  return $resource(API.economicSector, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });



});
