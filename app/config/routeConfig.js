angular.module("sgeApp").config(function ($routeProvider) {

    $routeProvider.when("/provincias", {
        templateUrl: "views/province/listar.html",
        controller: "ProvinceController",
        label: 'Províncias',
        title: 'Províncias'

    }).when("/provincias/criar", {
        templateUrl: "views/province/create.html",
        controller: "ProvinceController",
        label: 'Criar',
        title: 'Criar Província'
    }).when("/provincias/editar", {
        templateUrl: "views/province/create.html",
        controller: "ProvinceController",
        label: 'Editar',
        title: 'Editar Província'
    });
    
    $routeProvider.when("/validar-entidade", {
        templateUrl: "views/home/validateEntity.html",
        label: 'Validar Entidade',
        title: 'Validar Entidade'
    });

    $routeProvider.when("/paises", {
        templateUrl: "views/country/listar.html",
        controller: "CountryController",
        label: 'Países',
        title: 'Países'
    }).when("/paises/criar", {
        templateUrl: "views/country/create.html",
        controller: "CountryController",
        label: 'Criar',
        title: 'Criar País'
    }).when("/paises/editar", {
        templateUrl: "views/country/create.html",
        controller: "CountryController",
        label: 'Editar',
        title: 'Editar País'
    });

    $routeProvider.when("/actividades-comerciais", {
        templateUrl: "views/commercialActivity/listar.html",
        controller: "CommercialActivityController",
        label: 'Actividade Comercial',
        title: 'Actividades Comerciais'
    }).when("/actividades-comerciais/criar", {
        templateUrl: "views/commercialActivity/create.html",
        controller: "CommercialActivityController",
        label: 'Criar',
        title: 'Criar Actividade Comercial'
    }).when("/actividades-comerciais/editar", {
        templateUrl: "views/commercialActivity/create.html",
        controller: "CommercialActivityController",
        label: 'Editar',
        title: 'Editar Actividade Comercial'
    });

    $routeProvider.when("/sectores", {
        templateUrl: "views/sector/listar.html",
        controller: "SectorController",
        label: 'Sectores',
        title: 'Sectores Institucionais'
    }).when("/sectores/criar", {
        templateUrl: "views/sector/create.html",
        controller: "SectorController",
        label: 'Criar',
        title: 'Criar Sector Institucional'
    }).when("/sectores/editar", {
        templateUrl: "views/sector/create.html",
        controller: "SectorController",
        label: 'Editar',
        title: 'Eitar Sector Institucional'
    });

    $routeProvider.when("/formas-juridicas", {
        templateUrl: "views/legalForm/listar.html",
        controller: "LegalFormController",
        label: 'Forma Jurídica',
        title: 'Formas Jurídicas'
    }).when("/formas-juridicas/criar", {
        templateUrl: "views/legalForm/create.html",
        controller: "LegalFormController",
        label: 'Criar',
        title: 'Criar Forma Jurídica'
    }).when("/formas-juridicas/editar", {
        templateUrl: "views/legalForm/create.html",
        controller: "LegalFormController",
        label: 'Editar',
        title: 'Editar Forma Jurídica'
    });

    $routeProvider.when("/municipios", {
        templateUrl: "views/county/listar.html",
        controller: "CountyController",
        label: 'Municípios',
        title: 'Municípios'
    }).when("/municipios/criar", {
        templateUrl: "views/county/create.html",
        controller: "CountyController",
        label: 'Criar',
        title: 'Criar Município'
    }).when("/municipios/editar", {
        templateUrl: "views/county/create.html",
        controller: "CountyController",
        label: 'Editar',
        title: 'Editar Município'
    });

    $routeProvider.when("/comunas", {
        templateUrl: "views/commune/listar.html",
        controller: "CommuneController",
        label: 'Comunas',
        title: 'Comunas'
    }).when("/comunas/criar", {
        templateUrl: "views/commune/create.html",
        controller: "CommuneController",
        label: 'Criar',
        title: 'Criar Comuna'
    }).when("/comunas/editar", {
        templateUrl: "views/commune/create.html",
        controller: "CommuneController",
        label: 'Editar',
        title: 'Editar Comuna'
    });

    $routeProvider.when("/contabilidade", {
        templateUrl: "views/accounting/listar.html",
        controller: "AccountingController",
        label: 'Contabilidades das Empresas',
        title: 'Contabilidade das Empresas'
    }).when("/contabilidade/criar", {
        templateUrl: "views/accounting/create.html",
        controller: "AccountingController",
        label: 'Criar',
        title: 'Criar Item de Contabilidade'
    }).when("/contabilidade/editar", {
        templateUrl: "views/accounting/create.html",
        controller: "AccountingController",
        label: 'Editar',
        title: 'Editar Contabilidade das Empresas'
    });

    $routeProvider.when("/origens-documento", {
        templateUrl: "views/documentOrigin/listar.html",
        controller: "DocumentOriginController",
        label: 'Origens de Documento',
        title: 'Origens de Documento'
    }).when("/origens-documento/criar", {
        templateUrl: "views/documentOrigin/create.html",
        controller: "DocumentOriginController",
        label: 'Criar',
        title: 'Criar Origem de Documento'
    }).when("/origens-documento/editar", {
        templateUrl: "views/documentOrigin/create.html",
        controller: "DocumentOriginController",
        label: 'Editar',
        title: 'Editar Origem de Documento'
    });

    $routeProvider.when("/generos", {
        templateUrl: "views/gender/listar.html",
        controller: "GenderController",
        label: 'Gêneros',
        title: 'Gêneros'
    }).when("/generos/criar", {
        templateUrl: "views/gender/create.html",
        controller: "GenderController",
        label: 'Criar',
        title: 'Criar Gênero'
    }).when("/generos/editar", {
        templateUrl: "views/gender/create.html",
        controller: "GenderController",
        label: 'Editar',
        title: 'Editar Gênero'
    });

    $routeProvider.when("/actividade-economica", {
        templateUrl: "views/economicActivity/listar.html",
        controller: "EconomicActivityController",
        label: 'CAE',
        title: 'CAE'
    }).when("/actividade-economica/criar", {
        templateUrl: "views/economicActivity/create.html",
        controller: "EconomicActivityController",
        label: 'Criar',
        title: 'Criar CAE'
    }).when("/actividade-economica/editar", {
        templateUrl: "views/economicActivity/create.html",
        controller: "EconomicActivityController",
        label: 'Editar',
        title: 'Editar CAE'
    });

    $routeProvider.when("/titulos-academicos", {
        templateUrl: "views/academicDegree/listar.html",
        controller: "AcademicDegreeController",
        label: 'Títulos Académicos',
        title: 'Títulos Académicos'
    }).when("/titulos-academicos/criar", {
        templateUrl: "views/academicDegree/create.html",
        controller: "AcademicDegreeController",
        label: 'Criar',
        title: 'Criar Título Académico'
    }).when("/titulos-academicos/editar", {
        templateUrl: "views/academicDegree/create.html",
        controller: "AcademicDegreeController",
        label: 'Editar',
        title: 'Editar Título Académico'
    });

    $routeProvider.when("/situacao-empresa", {
        templateUrl: "views/companyCondition/listar.html",
        controller: "CompanyConditionController",
        label: 'Situação das Empresas',
        title: 'Situação das Empresas'
    }).when("/situacao-empresa/criar", {
        templateUrl: "views/companyCondition/create.html",
        controller: "CompanyConditionController",
        label: 'Criar',
        title: 'Criar Situação da Empresa'
    }).when("/situacao-empresa/editar", {
        templateUrl: "views/companyCondition/create.html",
        controller: "CompanyConditionController",
        label: 'Editar',
        title: 'Editar Situação da Empresa'
    });

    $routeProvider.when("/canal-recepcao", {
        templateUrl: "views/receptionChannel/listar.html",
        controller: "ReceptionChannelController",
        label: 'Canais de Recepção',
        title: 'Canais de Recepção'
    }).when("/canal-recepcao/criar", {
        templateUrl: "views/receptionChannel/create.html",
        controller: "ReceptionChannelController",
        label: 'Criar',
        title: 'Criar Canal de Recepção'
    }).when("/canal-recepcao/editar", {
        templateUrl: "views/receptionChannel/create.html",
        controller: "ReceptionChannelController",
        label: 'Editar',
        title: 'Editar Canal de Recepção'
    });

    $routeProvider.when("/tipo-funcionarios", {
        templateUrl: "views/functionType/listar.html",
        controller: "FunctionTypeController",
        label: 'Tipos de Funcionário',
        title: 'Tipos de Funcionário'
    }).when("/tipo-funcionarios/criar", {
        templateUrl: "views/functionType/create.html",
        controller: "FunctionTypeController",
        label: 'Criar',
        title: 'Criar Tipo de Funcionário'
    }).when("/tipo-funcionarios/editar", {
        templateUrl: "views/functionType/create.html",
        controller: "FunctionTypeController",
        label: 'Editar',
        title: 'Editar Tipo de Funcionário'
    });

    // Collective Entity Routes
    $routeProvider.when("/entidades-coletivas/criar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Criar',
        title: 'Criar Entidade Coletiva',
        name: 'create'
    }).when("/entidades-coletivas", {
        templateUrl: "views/collectiveEntity/listar.html",
        controller: "CollectiveEntityController",
        label: 'Entidades Coletivas',
        title: 'Entidades Coletivas',
        name: 'list'
    }).when("/entidades-coletivas/eliminadas", {
        templateUrl: "views/collectiveEntity/listar.html",
        controller: "CollectiveEntityController",
        label: 'Eliminadas',
        title: 'Entidades Coletivas Eliminadas',
        name: 'deleted'
    }).when("/entidades-coletivas/aprovadas", {
        templateUrl: "views/collectiveEntity/listar.html",
        controller: "CollectiveEntityController",
        label: 'Aprovadas',
        title: 'Entidades Coletivas Aprovadas',
        base: '/entidades-coletivas/aprovadas',
        name: 'aproved'
    }).when("/entidades-coletivas/aprovadas/criar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Criar',
        title: 'Criar Entidades Coletivas',
        base: '/entidades-coletivas/aprovadas',
        name: 'create'
    }).when("/entidades-coletivas/aprovadas/editar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Editar',
        title: 'Editar Entidade Coletiva',
        base: '/entidades-coletivas/aprovadas',
        name: 'edit'
    }).when("/entidades-coletivas/aprovadas/renovar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Renovar',
        title: 'Renovar Entidade Coletiva',
        base: '/entidades-coletivas/aprovadas/renovar',
        name: 'renew'
    }).when("/entidades-coletivas/renovar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Renovar',
        title: 'Renovar Entidade Coletiva',
        name: 'renew'
    }).when("/entidades-coletivas/por-aprovar", {
        templateUrl: "views/collectiveEntity/listar.html",
        controller: "CollectiveEntityController",
        label: 'Por Aprovar',
        title: 'Entidades Coletivas Por Aprovar',
        base: '/entidades-coletivas/por-aprovar',
        name: 'to-aprove'
    }).when("/entidades-coletivas/por-renovar", {
        templateUrl: "views/collectiveEntity/listar.html",
        controller: "CollectiveEntityController",
        label: 'Por Renovar',
        title: 'Entidades Coletivas Por Renovar',
        base: '/entidades-coletivas/por-renovar',
        name: 'to-renew'
    }).when("/entidades-coletivas/por-renovar/editar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Editar',
        title: 'Editar Entidade Coletiva',
        base: '/entidades-coletivas/por-renovar',
        name: 'edit'
    }).when("/entidades-coletivas/por-renovar/renovar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Renovar',
        title: 'Renovar Entidade Coletiva',
        base: '/entidades-coletivas/por-renovar',
        name: 'renew'
    }).when("/entidades-coletivas/por-aprovar/criar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Criar',
        title: 'Criar Entidades Coletivas',
        base: '/entidades-coletivas/por-aprovar',
        name: 'create'
    }).when("/entidades-coletivas/por-aprovar/editar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Editar',
        title: 'Editar Entidade Coletiva',
        base: '/entidades-coletivas/por-aprovar',
        name: 'edit'
    }).when("/entidades-coletivas/editar", {
        templateUrl: "views/collectiveEntity/create.html",
        controller: "CollectiveEntityController",
        label: 'Editar',
        title: 'Editar Entidade Coletiva',
        name: 'edit'
    });

    // Single Entity Routes
    $routeProvider.when("/entidades-individuais/criar", {
        templateUrl: "views/singleEntity/create.html",
        controller: "SingleEntityController",
        label: 'Criar',
        title: 'Criar Entidade Individual',
        name:'create'
    }).when("/entidades-individuais", {
        templateUrl: "views/singleEntity/listar.html",
        controller: "SingleEntityController",
        label: 'Entidades Individuais',
        title: 'Entidades Individuais',
        name: 'list'
    }).when("/entidades-individuais/editar", {
        templateUrl: "views/singleEntity/create.html",
        controller: "SingleEntityController",
        label: 'Editar',
        title: 'Editar Entidade Individual',
        name:'edit'
    });

    $routeProvider.when("/configuracoes-globais", {
        templateUrl: "views/configurations/global.html",
        controller: "GlobalConfigController",
        label: 'Configurações Globais'
    }).when("/configuracoes-smtp", {
        templateUrl: "views/configurations/smtp.html",
        controller: "SMTPConfigController",
        label: 'Configurações SMTP'
    }).when("/configuracoes-mensagens", {
        templateUrl: "views/configurations/messages.html",
        controller: "MessagesConfigController",
        label: 'Configurações de Mensagens'
    });

    // Messages routes
    $routeProvider.when("/mensagens", {
        templateUrl: "views/messages/list.html",
        controller: "MessagesController",
        label: 'Mensagens',
        title: 'Mensagens',
        name: 'all'
    }).when("/mensagens/recebidas", {
        templateUrl: "views/messages/list.html",
        controller: "MessagesController",
        label: 'Recebidas',
        title: 'Mensagens Recebidas',
        name: 'received'
    }).when("/mensagens/enviadas", {
        templateUrl: "views/messages/list.html",
        controller: "MessagesController",
        label: 'Enviadas',
        title: 'Mensagens Enviadas',
        name: 'sent'
    });
    
    // Indicators routes
    $routeProvider.when("/indicadores-nao-atualizadas", {
        templateUrl: "views/indicators/entitiesNotUpdated.html",
        controller: "IndicatorsController",
        label: 'Indicdores Entidades Não Atualizadas',
        title: 'Indicdores: Entidades Não Atualizadas',
        name: 'all'
    }).when("/indicadores-criadas-eliminadas", {
        templateUrl: "views/indicators/entitiesCreatedEliminated.html",
        controller: "IndicatorsController",
        label: 'Indicadores Entidades Criadas e Eliminadas',
        title: 'Indicadores: Entidades Criadas e Eliminadas',
        name: 'received'
    }).when("/indicadores-por-provincia", {
        templateUrl: "views/indicators/entitiesByProvince.html",
        controller: "IndicatorsController",
        label: 'Indicadores Entidades Por Províncias',
        title: 'Indicadores: Entidades Por Províncias',
        name: 'sent'
    }).when("/indicadores-homens-mulheres-ano", {
        templateUrl: "views/indicators/menWomenByYear.html",
        controller: "IndicatorsController",
        label: 'Indicadores Homens e Mulheres Por Ano',
        title: 'Indicadores: Homens e Mulheres Por Ano',
        name: 'sent'
    });

    $routeProvider.when("/", {
        label: 'Início',
        title: 'Início'
    }).when("/login", {
        templateUrl: "views/login/index.html"
    });

    $routeProvider.otherwise({redirectTo: "/index"});
});
