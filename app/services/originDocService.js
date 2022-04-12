angular.module("sgeApp").factory("OriginDocService", function ($resource, API) {

  return $resource(API.originDocs, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });

});
