angular.module("sgeApp").factory("EntityService", function ($resource, API) {

    return $resource(API.entity, null, {
        delete: {method: 'DELETE',data:{}},
        search: {
            params: {res: 'search'},
        },
        update: {method: 'PUT'},
        getCollective: {
            params: {type: 'collective'}
        },
        getSingle: {
            params: {type: 'individuais'}
        },
        getCollectiveApproved: {
            params: {type: 'collective', state: 'aprovadas'}
        },
        getSingleApproved: {
            params: {type: 'individuais', state: 'aprovadas'}
        },
        getCollectiveToApprove: {
            params: {type: 'collective', state: 'poraprovar'}
        },
        getSingleToApprove: {
            params: {type: 'individuais', state: 'poraprovar'}
        },
        getCollectiveDeleted: {
            params: {type: 'collective', state: 'apagadas'}
        },
        getSingleDeleted: {
            params: {type: 'individuais', state: 'apagadas'}
        },
        approve: {
            method: 'POST',
            params: {res: 'aprovarentidades'}
        },
        disapprove: {
            method: 'POST',
            data: {},
            params: {res: 'reprovarentidades'}
        },
        renew: {
            method: 'POST',
            params: {res: 'renovarentidades'}
        },
        getToRenew: {
            params: {res: 'porrenovar'}
        },
    });


});