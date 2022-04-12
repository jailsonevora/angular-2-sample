var baseUrl = "https://api.ine.gov.ao/sge/api/v1/";
angular.module("sgeApp").constant("API", {
    base: baseUrl,
    messages: baseUrl + 'mensagens/:id/:keyword/:res',
    entity: baseUrl + 'entidades/:type/:state/:id/:keyword/:res',
    entityValidation: baseUrl + 'validaentidades/:key',
    country: baseUrl + 'paises/:id/:keyword/:res/:rid',
    commune: baseUrl + 'comunas/:id/:keyword/:res',
    province: baseUrl + 'provincias/:id/:keyword/:res/:rid',
    county: baseUrl + 'municipios/:id/:keyword/:res/:rid',
    originDocs: baseUrl + 'origemdocumentos/:id/:keyword/:res',
    commercialActivity: baseUrl + 'actividadescomerciais/:id/:keyword/:res',
    economicActivities: baseUrl + 'caes/:id/:keyword/:res',
    accounting: baseUrl + 'contabilidades/:id/:keyword/:res',
    gender: baseUrl + 'generos/:id/:keyword/:res',
    academicDegree: baseUrl + 'titulosacademicos/:id/:keyword/:res',
    economicSector: baseUrl + 'sectores/:id/:keyword/:res',
    entityCondition: baseUrl + 'situacoes/:id/:keyword/:res',
    legalForm: baseUrl + 'formasjuridicas/:id/:keyword/:res',
    employeeType: baseUrl + 'tipofuncoes/:id/:keyword/:res',
    receptionChannel: baseUrl + 'canaisrecepcoes/:id/:keyword/:res',
});
baseUrl = undefined;
