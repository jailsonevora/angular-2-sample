angular.module("sgeApp").value("Labels", {
    labels: {
        economicActivities: 'Atividades Económicas',
        conditions: 'Situação'
    },
    entities: {
        nif: ['Nif', 'required', 'show'],
        nome: ['Nome', 'required', 'show'],
        abreviatura: ['Abreviatura', 'required', 'show'],
        estadoAprovacao: ['Estado Aprovação', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    provinces: {
        codigo: ['Código', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],
        'pais.pais': ['País', 'required', 'show'],
        sigla: ['Sigla', 'required', 'show']
    },
    counties: {
        codigo: ['Código', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],
        'provincia.designacao': ['Província', 'required', 'show'],
        'provincia.pais.pais': ['País', 'required', 'show']
    },
    countries: {
        pais: ['País', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    messages: {
        titulo: ['Título', 'required', 'show'],
        remetente: ['Remetente', 'required', 'show'],
        destinatario: ['Destinatário', 'required', 'show']
    },
    academicDegrees: {
        titulo: ['Título', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    communes: {
        codigo: ['Código', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],
        'municipio.designacao': ['Município', 'required', 'show'],
        'municipio.provincia.designacao': ['Província', 'required', 'show'],
        'municipio.provincia.pais.pais': ['País', 'required', 'show']
    },
    actividadeComercial: {
      cac: ['Código', 'required', 'show'],
      cacDsg: ['Designação', 'required', 'show'],
      estado: ['Estado', 'required', 'show'],
    },
    economicActivities: {
        cae: ['CAE', 'required', 'show'],
        classname: ['Classname', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    commercialActivities: {
        cac: ['Código', 'required', 'show'],
        cacDsg: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    commercialBuilding: {
        numEstabelecimento: ['Nº Estab', 'required', 'show'],
        sede: ['Sede', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],
    },
    conditions: {
        cod: ['Código', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        condition: ['Situação', 'required', 'show']
    },
    genders: {
        sexo: ['Sexo', 'required', 'show'],
        estado: ['Estado', 'required', 'show']

    },
    originDocs: {
        origem: ['Origem', 'required', 'show'],
        origemDsg: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    economicSector: {
        sector: ['Setor', 'required', 'show'],
        sectorDsg: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    employType: {
        tipo: ['Tipo de Função', 'required', 'show'],
        estado: ['Estado', 'required', 'show']
    },
    legalForm: {
        fjr: ['FJR', 'required', 'show'],
        formaJuridica: ['Forma Jurídica', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    accountings: {
        cnta: ['Código', 'required', 'show'],
        cntaDsg: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    companyConditions: {
        sta: ['Código', 'required', 'show'],
        designacao: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    receptionChannels: {
        canal: ['Designação', 'required', 'show'],
        estado: ['Estado', 'required', 'show'],

    },
    businessPartner: {
        estado: ['Estado', 'required', 'show'],
        nome: ['Nome', 'required', 'show'],
        numero: ['Número', 'required', 'show']
    }
});
