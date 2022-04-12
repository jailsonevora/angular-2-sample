angular.module("sgeApp").factory("CountyService", function ($resource, API) {

    return $resource(API.county, {}, {
        delete: {method: 'DELETE',data:{}},
        update: {method: 'PUT'},
        getCommunes: {

            params: {res: 'comunas'},
        },
        saveCommune: {
            method: 'POST',
            params: {res: 'comunas'},
        },
        deleteCommune: {
            method: 'DELETE',
            data: {},
            params: {res: 'comunas'},
        }
    });


});
