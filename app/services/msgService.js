angular.module("sgeApp").factory("MsgService", function ($resource, API) {

    return $resource(API.messages, {}, {
        delete: {method: 'DELETE',data:{}},
        search: {
            params: {res: 'search'},
        },
        new : {
            params: {res: 'novas'}
        }
    });


});
