angular.module("sgeApp").factory("EmployeeTypeService", function ($resource, API) {

  return $resource(API.employeeType, null, {
    delete: {method: 'DELETE',data:{}},
    update: {method: 'PUT'}
  });


});
