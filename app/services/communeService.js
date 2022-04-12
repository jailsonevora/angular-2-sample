angular.module("sgeApp").factory("CommuneService", function ($resource, API) {

  return $resource(API.commune, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });

});
