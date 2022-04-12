angular.module("sgeApp").factory("EconomicActivitiesService", function ($resource, API) {

  return $resource(API.economicActivities, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });



});
