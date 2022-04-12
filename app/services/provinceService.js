angular.module("sgeApp").factory("ProvinceService", function ($resource, API) {

    return $resource(API.province, {}, {
        delete: {method: 'DELETE',data:{}},
        update: {method: 'PUT'},
        getCounties: {

            params: {res: 'municipios'},
        },
        saveCounty: {
            method: 'POST',
            params: {res: 'municipios'},
        },
        deleteCounty: {
            method: 'DELETE',
            data: {},
            params: {res: 'municipios'},
        }
    });


});
