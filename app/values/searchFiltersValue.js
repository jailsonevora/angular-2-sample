angular.module("sgeApp").value("searchFilters", {
    entity: {
        selectFields: {
            estadoAprovacao: {
                1:'Aprovado',
                0: 'Por aprovar'
            },
            estado: {
                1: 'Ativo',
                0: 'Inativo'
            }
        },
        numericFields: ['nif'],
        dateFields: ['origemDoc'],
        referenceFields: {
            conditions: []
        },
        referenceFieldsBig: {
            economicActivities: []
        }
    }
});
