angular.module("sgeApp").factory("ReceptionChannelService", function ($resource, API) {

  return $resource(API.receptionChannel, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });


});
