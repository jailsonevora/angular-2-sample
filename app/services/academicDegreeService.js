angular.module("sgeApp").factory("AcademicDegreeService", function ($resource, API) {

        return $resource(API.academicDegree, null, {
          delete: {method: 'DELETE',data:{}},
          update: {method: 'PUT'}
        });


});
