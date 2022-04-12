angular.module("sgeApp").factory("CountryService", function ($resource, API) {
    return $resource(API.country, {}, {
        delete: {method: 'DELETE',data:{}},
        update: {method: 'PUT'},
        search: {
            params: {res: 'search'},
        },
        getProvinces: {

            params: {res: 'provincias'},
        },
        saveProvince: {
            method: 'POST',
            params: {res: 'provincias'},
        },
        deleteProvince: {
            method: 'DELETE',
            data: {},
            params: {res: 'provincias'},
        }
    });

});
