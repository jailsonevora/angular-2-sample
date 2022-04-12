angular.module("sgeApp").controller("CollectiveEntityController",
        function ($q, $scope, $route, searchFilters, $location, AccountingService, LegalFormService, $timeout,
                EconomicActivitiesService, EntityService, ReceptionChannelService, CommuneService,
                UtilsService, EmployeeTypeService, CommercialActivityService, OriginDocService,
                CompanyConditionService, ProvinceService, CountryService, EconomicSectorService, CountyService) {
//            console.log($route);

            var APP = $scope.$parent.app;
            $scope.page = $route.current.name;

            $scope.labels = $scope.$parent.session.getLabels();

            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                entity: {},
                commercialBuilding: {}
            };
            $scope.receptionChannel = {};
            $scope.counties = {};
            $scope.provinces = {};
            $scope.legalForm = {};
            $scope.countries = {};
            $scope.businessPartner = UtilsService.tableStructure($scope.labels.businessPartner);
            $scope.commercialBuilding = UtilsService.tableStructure($scope.labels.commercialBuilding);
            $scope.commercialBuilding.cae = [];
            $scope.communes = {};
            $scope.accounting = {};
            $scope.companyCondition = {};
            $scope.employeeType = {};
            $scope.provincias = [];

            // TODO: BEWARE OF HARDCODED ID!!
            $scope.entity = {
                tipoEntidade: {id: 53},
                cae: [],
                estabelecimento: [],
                socio: [],
                porRenovar: false
            };

            $scope.entities = {};
            $scope.structures = {
                entity: {}
            };
            $scope.activities = {};
            $scope.activities.secondary = [];
            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.entity,
                values: {
                    selectFields: {},
                    numericFields: {},
                    dateFields: {},
                    referenceFields: {},
                    referenceFieldsBig: {}
                },
                fn: {
                    referenceBigModal: searchFilterRefBigModal,
                    sort: sort
                },
                submit: searchFilterSubmit,
                query: {
                    size: APP.config.pageSize
                }

            };
            var queryDefaults = {
                size: APP.config.pageSize,
                page: 0
            };
            $scope.actions = {};
            $scope.pagination = {page: page};
            $scope.buttons = {};
            $scope.state = {
                approve: false,
                innerView: false,
            };
            $scope.msgValidate = {titulo: 'Aprovação INE'};
            $scope.tab = {current: null, subtab: 'companyActivities'};
            $scope.tableStatic = {actions: {view: innerView}};
            var route = {
                base: $route.current.base ? $route.current.base : '/entidades-coletivas',
                create: '/criar',
                edit: '/editar',
                renew: '/renovar'
            };

            if ($scope.page == 'create' || $scope.page == 'edit' || $scope.page == 'renew') {

                $scope.addToTable = {
                    state: {
                        edit: false
                    }
                };

                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                    //console.log($scope.countries);
                });
                LegalFormService.get().$promise.then(function (response) {
                    $scope.legalForm = response.content;
                });
                CompanyConditionService.get().$promise.then(function (response) {
                    $scope.companyCondition = response.content;
                });
                EmployeeTypeService.get().$promise.then(function (response) {
                    $scope.employeeType = response.content;
                });
                ReceptionChannelService.get().$promise.then(function (response) {
                    $scope.receptionChannel = response.content;
                });
                AccountingService.get().$promise.then(function (response) {
                    $scope.accounting = response.content;
                });
                if (($scope.page == 'edit' || $scope.page == 'renew')
                        && !angular.equals($scope.$parent.savedStates, {})) {
                    console.log($scope.$parent.savedStates);
                    $scope.entity = $scope.$parent.savedStates.entity;
                    $scope.display = $scope.$parent.savedStates.display;
                    getProvinces($scope.entity.contacto.pais);
                    getCounties($scope.entity.contacto.provincia);
                    getCommunes($scope.entity.contacto.municipio);
                }
            } else if ($scope.page == 'list' || $scope.page == 'aproved'
                    || $scope.page == 'to-aprove' || $scope.page == 'deleted'
                    || $scope.page == 'to-renew') {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove
                };
                $scope.buttons = {
                    create: function () {
                        $location.path(route.base + route.create);
                    },
                    remove: bulkDelete
                };

                if ($scope.page == 'aproved') {
                    EntityService.getCollectiveApproved(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                } else if ($scope.page == 'to-aprove') {
                    $scope.actions.custom = {
                        approve: {i: 'ion-checkmark-round', fn: approveModal}
                    };
                    EntityService.getCollectiveToApprove(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });

                } else if ($scope.page == 'deleted') {
                    $scope.actions = {view: view};
                    $scope.buttons = {};
                    $scope.bulkSelect = null;
                    EntityService.getCollectiveDeleted(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                } else if ($scope.page == 'to-renew') {
                    $scope.actions.custom = {
                        renewal: {i: 'ion-checkmark-round', fn: renewalCompare}
                    };
                    EntityService.getToRenew(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                } else {
                    $scope.actions.custom = {
                        renewal: {i: 'ion-android-note', fn: renewal}
                    };
                    resetList();
                }

                CompanyConditionService.get().$promise.then(function (response) {
                    $scope.searchFilters.scheme.referenceFields.conditions = UtilsService.prepareSelectObj(response.content, 'designacao');
//                    console.log($scope.searchFilters.scheme.referenceFields.conditions);
                });
            }

            function pagination(response) {
                $scope.pagination.totalElements = response.totalElements;
                $scope.pagination.numberOfElements = response.numberOfElements;
                $scope.pagination.totalPages = response.totalPages;
                $scope.pagination.first = response.first;
                $scope.pagination.last = response.last;
                $scope.pagination.number = response.number;
            }

            function singleSearchSubmit() {
                EntityService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.entities = response.content;
                    pagination(response);
                });
            }

            function page(num) {
                $scope.searchFilters.query.page = num;
                searchFilterSubmit(false);
            }

            function sort(col, asc) {
                if (asc) {
                    $scope.searchFilters.query.sort = col + ',asc';

                } else {
                    $scope.searchFilters.query.sort = col + ',desc';

                }
                $scope.searchFilters.query.page = queryDefaults.page;
                searchFilterSubmit(false);
            }

            function searchFilterSubmit(requery = true) {
                if (requery) {
                    $scope.searchFilters.query = UtilsService.getQueryObj($scope.searchFilters.values);
                    $scope.searchFilters.query.size = queryDefaults.size;
                }
                EntityService.getCollective($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.entities = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'economicActivities') {
                    EconomicActivitiesService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.economicActivities;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.select = searchEconomicActivityChosen;
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.resource = EconomicActivitiesService;
                        $scope.$parent.generic.modal.setPagination(response);
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
//                console.log($scope.entityForm.$error);
//                console.log($scope.entityForm.$valid);
                if ($scope.entityForm.$valid) {

                    if (context == 'edit')
                        EntityService.update({id: $scope.entity.id}, $scope.entity,
                                function (resp, headers) {
                                    //success callback
                                    $location.path(route.base);
                                    $scope.$parent.successMsg(function () {
//                                    console.log('ffffffffffff');
//                                    $location.path(route.base);
                                    });
                                },
                                function (err) {
                                    // error callback
                                    $scope.$parent.failureMsg();
                                });
                    else
                        EntityService.save($scope.entity,
                                function (resp, headers) {
                                    //success callback
                                    $location.path(route.base);
                                    $scope.$parent.successMsg(function () {
//                                    console.log('ffffffffffff');
//                                    $location.path(route.base);
                                    });
                                },
                                function (err) {
                                    // error callback
                                    $scope.$parent.failureMsg();
                                });
                } else {
                    $scope.$parent.emptyFieldMsg();
                }
            };

            $scope.renewEntity = function () {
                EntityService.renew({id: $scope.entity.id}, $scope.entity,
                        function (resp, headers) {
                            //success callback
                            $location.path(route.base);
                            $scope.$parent.successMsg();
                        },
                        function (err) {
                            // error callback
                            $scope.$parent.failureMsg();
                        });
            };


            function approveModal(i) {
                $scope.state.approve = true;
                view(i);
            }

            $scope.cancelMsg = function () {
                $scope.state.approve = true;
                $('#msg-validate-modal').modal('hide').one('hidden.bs.modal', function () {
                    $('#detail-modal').modal('show').one('hidden.bs.modal', function () {
                        $scope.state.approve = false;
                    });
                });

            };
            $scope.approveEntity = function () {
                $('#detail-modal').modal('hide').one('hidden.bs.modal', function () {
                    EntityService.approve({id: $scope.entity.id}, true,
                            function (resp, headers) {
                                //success callback
                                angular.forEach($scope.entities, function (v, k) {
                                    if (v.id == $scope.entity.id)
                                        $scope.entities.splice(k, 1);
                                });
                                $scope.$parent.successMsg();
                            },
                            function (err) {
                                // error callback
                                $scope.$parent.failureMsg();
                            });
                });

            };

            $scope.disapproveEntity = function () {
                $scope.msgValidate.comment = 'Motivo de recusa';
                $('#detail-modal').modal('hide').one('hidden.bs.modal', function () {
                    $('#msg-validate-modal').modal('show');
                });
            };

            $scope.submitMsg = function () {
//                $scope.msgValidate.remetente = 'rem1';
//                $scope.msgValidate.destinatario = 'dest1';
//                $scope.msgValidate.entidade = $scope.entity;
                $('#msg-validate-modal').modal('hide').one('hidden.bs.modal', function () {
                    EntityService.disapprove({id: $scope.entity.id}, $scope.msgValidate,
                            function (resp, headers) {
                                //success callback
                                $scope.$parent.successMsg();
                            },
                            function (err) {
                                // error callback
                                $scope.$parent.failureMsg();
                            });
                });
            };

            // TODO: Remeber tab and subtab state
            function innerView(i) {
//                console.log($scope.tab);
                $('#detail-modal').modal('hide').one('hidden.bs.modal', function () {
                    $scope.state.innerView = true;
                    if ($scope.tab.subtab == 'companyActivities') {
                        $scope.economicActivity = $scope.entity.cae[i];
                    } else if ($scope.tab.subtab == 'commercialBuildings') {
                        $scope.commercialBuilding = $scope.entity.estabelecimento[i];
//                        console.log($scope.commercialBuilding);
                    } else if ($scope.tab.subtab == 'businessPartners') {
                        $scope.businessPartner = $scope.entity.socio[i];
                    }
                    $timeout(function () {
                        $('#detail-modal').modal('show');
                    });
                    $('#detail-modal').one('hidden.bs.modal', function () {
                        $scope.state.innerView = false;
                        $scope.tab.subtab = 'companyActivities';
                        $timeout(function () {
                            $('#detail-modal').modal('show');
                        });
                    });
                });
            }

            function compareHighlight() {
                $('#compare-modal compare :input').attr('disabled', 'true');
                $('#compare-modal compare button').remove();
                var i = 0;
                $('#compare-modal compare.left ul.nav-tabs a').each(function (e) {
                    var id = $(this).attr('href').split('!#')[1];
                    $(this).attr('href', '!#' + id + i);
                    $('#compare-modal compare.left #' + id).attr('id', id + i);
//                    console.log(e);
                    i++;
                });
//                i=0;
                $('#compare-modal compare.right ul.nav-tabs a').each(function (e) {
                    var id = $(this).attr('href').split('!#')[1];
                    $(this).attr('href', '!#' + id + i);
                    $('#compare-modal compare.right #' + id).attr('id', id + i);
//                    console.log(e);
                    i++;
                });
                $('#compare-modal compare.right ul.nav-tabs li').click(function (e) {
                    var pos = $(this).index();
                    var tar = '#compare-modal compare.left ul.nav-tabs li:eq(' + pos + ') a';
                    $(tar).click();
//                    console.log($(tar)[0]);
                });
                angular.forEach($scope.entity, function (v, k) {
                    var $el = $('#compare-modal *[ng-model=\'entity.' + k + '\']');
                    if (v !== $scope.entityOld[k])
                        $el.addClass('diff');
                    else
                        $el.removeClass('diff');
                });
                $('#compare-modal').modal('show');
            }
            ;

            function renewalCompare(i) {
                edit(i, false, false);
                entityToRenew(i, function () {
                    compareHighlight();
                });
                $('#compare-modal').modal('show');
            }

            function entityToRenew(i, onLoad = null) {
                console.log($scope.entities[i].naturalId);
                EntityService.getToRenew({id: $scope.entities[i].naturalId}, function (resp, headers) {
//                    console.log(resp);
                    var entity = resp;
                    var display = {entity: {}};
                    display.entity.dataDocumento = UtilsService.dateDisplay(entity.dataDocumento, 'yyyy-mm-dd');
                    display.entity.dataCostituicao = UtilsService.dateDisplay(entity.dataCostituicao, 'yyyy-mm-dd');

                    promises = {};
                    promises.originDoc = OriginDocService.get({id: entity.origemDoc}).$promise;
                    promises.economicActivity = EconomicActivitiesService.get({id: entity.actiEcoPrincipal}).$promise;
                    promises.commercialActivity = CommercialActivityService.get({id: entity.actiComercial}).$promise;
                    promises.economicSector = EconomicSectorService.get({id: entity.sector.id}).$promise;

                    $q.all(promises).then(function (data) {
//                        console.log(data);
                        display.entity.origemDoc = data.originDoc.toJSON().origemDsg;
                        display.entity.actiEcoPrincipal = data.economicActivity.toJSON().designacao;
                        display.entity.sector = data.economicSector.toJSON().sectorDsg;
                        display.entity.actiComercial = data.commercialActivity.toJSON().cacDsg;

                        $scope.entityOld = entity;
                        $scope.displayOld = display;

                        if (onLoad)
                            onLoad();
                    });
                });
            }

            function view(i, modal = true) {
                if (modal)
                    $('#detail-modal').modal('show').one('hidden.bs.modal', function () {
                        $scope.state.approve = false;
                    });

                entity = $scope.entities[i];
                console.log(entity);
                $scope.entity = entity;
                $scope.display = {entity: {}};

                promises = {};
                promises.originDoc = OriginDocService.get({id: entity.origemDoc}).$promise;
                promises.economicActivity = EconomicActivitiesService.get({id: entity.actiEcoPrincipal}).$promise;
                promises.commercialActivity = CommercialActivityService.get({id: entity.actiComercial}).$promise;
                promises.economicSector = EconomicSectorService.get({id: entity.sector.id}).$promise;
                promises.country = CountryService.get({id: entity.contacto.pais}).$promise;
                promises.county = CountyService.get({id: entity.contacto.municipio}).$promise;
                promises.commune = CommuneService.get({id: entity.contacto.comuna}).$promise;
                promises.province = ProvinceService.get({id: entity.contacto.provincia}).$promise;
                promises.employeeType = EmployeeTypeService.get({id: entity.tipo}).$promise;
                promises.legalForm = LegalFormService.get({id: entity.formaJuridica}).$promise;
                promises.receptionChannel = ReceptionChannelService.get({id: entity.canal}).$promise;
                promises.condition = CompanyConditionService.get({id: entity.situacaoEmpresa}).$promise;
                promises.accounting = AccountingService.get({id: entity.contabilidade}).$promise;

                $q.all(promises).then(function (data) {
                    console.log(data);
                    $scope.display.entity.origemDoc = data.originDoc.toJSON().origemDsg;
                    $scope.display.entity.actiEcoPrincipal = data.economicActivity.toJSON().designacao;
                    $scope.display.entity.sector = data.economicSector.toJSON().sectorDsg;
                    $scope.display.entity.actiComercial = data.commercialActivity.toJSON().cacDsg;
                    $scope.display.entity.contacto = {};
                    $scope.display.entity.contacto.pais = data.country.toJSON().pais;
                    $scope.display.entity.contacto.comuna = data.commune.toJSON().designacao;
                    $scope.display.entity.contacto.provincia = data.province.toJSON().designacao;
                    $scope.display.entity.contacto.municipio = data.county.toJSON().designacao;
                    $scope.display.entity.tipo = data.employeeType.toJSON().tipo;
                    $scope.display.entity.formaJuridica = data.legalForm.toJSON().formaJuridica;
                    $scope.display.entity.canal = data.receptionChannel.toJSON().canal;
                    $scope.display.entity.situacaoEmpresa = data.condition.toJSON().designacao;
                    $scope.display.entity.contabilidade = data.accounting.toJSON().cntaDsg;
                });
            }

            function renewal(i) {
                edit(i, true);
            }

            function edit(i, renewal = false, goToLocation = true) {
                entity = $scope.entities[i];
                console.log(entity);
                display = {entity: {}};
                display.entity.dataDocumento = UtilsService.dateDisplay(entity.dataDocumento, 'yyyy-mm-dd');
                display.entity.dataCostituicao = UtilsService.dateDisplay(entity.dataCostituicao, 'yyyy-mm-dd');

                promises = {};
                promises.originDoc = OriginDocService.get({id: entity.origemDoc}).$promise;
                promises.economicActivity = EconomicActivitiesService.get({id: entity.actiEcoPrincipal}).$promise;
                promises.commercialActivity = CommercialActivityService.get({id: entity.actiComercial}).$promise;
                promises.economicSector = EconomicSectorService.get({id: entity.sector.id}).$promise;

                $q.all(promises).then(function (data) {
                    console.log(data);
                    display.entity.origemDoc = data.originDoc.toJSON().origemDsg;
                    display.entity.actiEcoPrincipal = data.economicActivity.toJSON().designacao;
                    display.entity.sector = data.economicSector.toJSON().sectorDsg;
                    display.entity.actiComercial = data.commercialActivity.toJSON().cacDsg;


                    if (goToLocation) {
                        $scope.$parent.savedStates.entity = entity;
                        $scope.$parent.savedStates.display = display;

                        if (renewal) {
                            $scope.$parent.savedStates.entity.porRenovar = true;
                            $location.path(route.base + route.renew);
                        } else
                            $location.path(route.base + route.edit);
                    } else {
                        $scope.entity = entity;
                        $scope.display = display;
                    }

                });
            }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Entidade';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta entidade?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.entities[i].id;
                    EntityService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.entities.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            function cbToggleSecondaryActivity(data) {
                var secondaryActivities = $scope.commercialBuilding.cae;
                var elExists = false;
                $scope.$parent.generic.modal.close(function () {
                    $('#commercial-building-form-modal').modal('show');
                });
                angular.forEach(secondaryActivities, function (v, k) {
                    if (v.id == data.id) {
                        elExists = true;
                        secondaryActivities.splice(k, 1);
                    }
                });
                if (!elExists)
                    secondaryActivities.push(data);
            }

            function toggleSecondaryActivity(data) {
                var secondaryActivities = $scope.entity.cae;
                var elExists = false;
                angular.forEach(secondaryActivities, function (v, k) {
                    if (v.id == data.id) {
                        elExists = true;
                        secondaryActivities.splice(k, 1);
                    }
                });
                if (!elExists)
                    secondaryActivities.push(data);
            }
            function searchEconomicActivityChosen(data) {
//                console.log(data);
                $scope.$parent.generic.modal.close();
                $scope.searchFilters.values.referenceFieldsBig.economicActivities = {id: data.id, name: data.designacao};
            }
            function originDocChosen(data) {
                $scope.$parent.generic.modal.close();
                $scope.display.entity.origemDoc = data.origemDsg;
                $scope.entity.origemDoc = data.id;
//                console.log('vvv');
//                console.log(data);
            }
            function primaryActivityChosen(data) {
                $scope.$parent.generic.modal.close();
                $scope.display.entity.actiEcoPrincipal = data.designacao;
                $scope.entity.actiEcoPrincipal = data.id;
            }
            function cbPrimaryActivityChosen(data) {
                $scope.$parent.generic.modal.close();
                $scope.display.commercialBuilding.actiEcoPrincipal = data.designacao;
                $scope.commercialBuilding.actiEcoPrincipal = data.id;
                $('#commercial-building-form-modal').modal('show');
            }
            function commercialActivityChosen(data) {
                $scope.$parent.generic.modal.close();
                $scope.display.entity.actiComercial = data.cacDsg;
                $scope.entity.actiComercial = data.id;
            }
            function economicSectorChosen(data) {
                $scope.$parent.generic.modal.close();
                $scope.display.entity.sector = data.sectorDsg;
                $scope.entity.sector = data;
            }

            $scope.commercialBuildingFormModal = function () {
                $scope.commercialBuilding.$invalid = true;
                $scope.addToTable.state.edit = false;
                $scope.commercialBuilding = UtilsService.tableStructure($scope.labels.commercialBuilding);
                $scope.commercialBuilding.cae = [];
                $('#commercial-building-form-modal').modal('show');
            };
            $scope.businessPartnerFormModal = function () {
                $scope.addToTable.state.edit = false;
                $scope.businessPartner = UtilsService.tableStructure($scope.labels.businessPartner);
                $('#business-partner-form-modal').modal('show');
            };

            $scope.commercialActivityModal = function () {
                CommercialActivityService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.commercialActivities;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = commercialActivityChosen;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.resource = CommercialActivityService;
                    $scope.$parent.generic.modal.setPagination(response);
                    $scope.$parent.generic.modal.show();
                    console.log(response.content);
                });
            };
            $scope.secondaryActivityModal = function (context = 'entityForm') {
                EconomicActivitiesService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.economicActivities;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = toggleSecondaryActivity;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.resource = EconomicActivitiesService;
                    $scope.$parent.generic.modal.setPagination(response);

                    if (context == 'commercialBuildingForm') {
                        $scope.$parent.generic.modal.select = cbToggleSecondaryActivity;

                        $('#commercial-building-form-modal').modal('hide').one('hidden.bs.modal', function () {
                            $scope.$parent.generic.modal.show();

                        });
                    } else {
                        $scope.$parent.generic.modal.show();

                    }
//                    console.log(response.content);
                });
            };
            function getProvinces(countryId, context = 'entityForm') {
                CountryService.getProvinces({id: countryId}).$promise.then(function (response) {
                    $scope.provinces[context] = response.content;
//                    console.log(response.content);
                });

            }
            function getCounties(provinceId, context = 'entityForm') {
                ProvinceService.getCounties({id: provinceId}).$promise.then(function (response) {
                    $scope.counties[context] = response.content;
//                    console.log($scope.countryResponse);
                });
            }
            function getCommunes(countyId, context = 'entityForm') {
                CountyService.getCommunes({id: countyId}).$promise.then(function (response) {
                    $scope.communes[context] = response.content;
//                    console.log(response.content);
                });
            }

            $scope.getProvinces = getProvinces;
            $scope.getCounties = getCounties;
            $scope.getCommunes = getCommunes;

            $scope.originDocModal = function () {
                OriginDocService.get(queryDefaults).$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.originDocs;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = originDocChosen;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.resource = OriginDocService;
                    $scope.$parent.generic.modal.setPagination(response);
                    $scope.$parent.generic.modal.show();
//                    console.log(response);
                });
            };
            $scope.primaryActivityModal = function (context = 'entityForm') {
                EconomicActivitiesService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.economicActivities;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = primaryActivityChosen;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.resource = EconomicActivitiesService;
                    $scope.$parent.generic.modal.setPagination(response);

                    if (context == 'commercialBuildingForm') {
                        $scope.$parent.generic.modal.select = cbPrimaryActivityChosen;

                        $('#commercial-building-form-modal').modal('hide').one('hidden.bs.modal', function () {
                            $scope.$parent.generic.modal.show();

                        });
                    } else {
                        $scope.$parent.generic.modal.show();

                    }
//                    console.log(response.content);
                });
            };
            $scope.economicSectorModal = function () {
                EconomicSectorService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.economicSector;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = economicSectorChosen;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.resource = EconomicSectorService;
                    $scope.$parent.generic.modal.setPagination(response);
                    $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                });
            };

            $scope.addBusinessPartner = function () {
                if ($scope.partnerForm.$valid) {
                    $scope.entity.socio.push($scope.businessPartner);
                    $('#business-partner-form-modal').modal('hide');
                } else {
                    $('#business-partner-form-modal').modal('hide').one('hidden.bs.modal', function () {
                        $timeout(function () {
                            $scope.$parent.emptyFieldMsg(function () {
                                $('#business-partner-form-modal').modal('show');
                            });
                        });
                    });
                }
            };
            $scope.addCommercialBuilding = function () {
                if ($scope.cbForm.$valid) {
                    $scope.entity.estabelecimento.push($scope.commercialBuilding);
//                console.log($scope.entity);
                    $('#commercial-building-form-modal').modal('hide');
                } else {
                    $('#commercial-building-form-modal').modal('hide').one('hidden.bs.modal', function () {
                        $timeout(function () {
                            $scope.$parent.emptyFieldMsg(function () {
                                $('#commercial-building-form-modal').modal('show');
                            });
                        });
                    });
                }
            };

            $scope.$watch('tab.subtab', function () {
                if ($scope.addToTable) {
                    $scope.addToTable.actions = {};
                    if ($scope.tab.subtab == 'companyActivities') {
                        $scope.addToTable.actions.remove = deleteCompanyActivity;
                    } else if ($scope.tab.subtab == 'commercialBuildings') {
                        $scope.addToTable.actions.edit = editCommercialBuilding;
                        $scope.addToTable.actions.remove = deleteCommercialBuilding;
                    } else if ($scope.tab.subtab == 'businessPartners') {
                        $scope.addToTable.actions.edit = editBusinessPartner;
                        $scope.addToTable.actions.remove = deleteBusinessPartner;
                    }
                }
            });

            function deleteCommercialBuilding(i) {
                if ($scope.page == 'create')
                    $scope.entity.estabelecimento.splice(i, 1);
            }
            function deleteCompanyActivity(i) {
                if ($scope.page == 'create')
                    $scope.entity.cae.splice(i, 1);
            }
            function deleteBusinessPartner(i) {
                if ($scope.page == 'create')
                    $scope.entity.socio.splice(i, 1);
            }

            function editCommercialBuilding(i) {
                $scope.addToTable.state.edit = true;
                $scope.commercialBuilding = $scope.entity.estabelecimento[i];
                getProvinces($scope.commercialBuilding.contacto.pais, 'commercialBuildingForm');
                getCounties($scope.commercialBuilding.contacto.provincia, 'commercialBuildingForm');
                getCommunes($scope.commercialBuilding.contacto.municipio, 'commercialBuildingForm');
                EconomicActivitiesService.get({id: $scope.commercialBuilding.actiEcoPrincipal}, function (resp) {
//                    console.log(resp);
                    $scope.display.commercialBuilding = {};
                    $scope.display.commercialBuilding.actiEcoPrincipal = resp.designacao;
                });
                $('#commercial-building-form-modal').modal('show');
            }

            function editBusinessPartner(i) {
                $scope.addToTable.state.edit = true;
                $scope.businessPartner = $scope.entity.socio[i];
                $('#business-partner-form-modal').modal('show');
            }

            function resetList() {
                EntityService.getCollective(queryDefaults).$promise.then(function (response) {
                    $scope.entities = response.content;
                    $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                    pagination(response);
                });
            }

            function resetBulkSelect() {
                $scope.bulkSelect.all = false;
                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    $scope.bulkSelect.items[k] = false;
                });
            }

            $scope.$watchGroup(['entity.numFuncionarioHomem', 'entity.numFuncionarioMulher'], function () {
                $scope.entity.numFuncionario = $scope.entity.numFuncionarioHomem + $scope.entity.numFuncionarioMulher;
            });
            $scope.$watchGroup(['commercialBuilding.numFuncHomem', 'commercialBuilding.numFuncMulher'], function () {
                $scope.commercialBuilding.numFunc = $scope.commercialBuilding.numFuncHomem + $scope.commercialBuilding.numFuncMulher;
            });
            $scope.$watch('bulkSelect.all', function () {
                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    $scope.bulkSelect.items[k] = $scope.bulkSelect.all;
                });
            });
            $scope.$watch('entity.dataDocumento', function () {
                console.log($scope.entity.dataDocumento);
//                console.log($scope.entity.dataCostituicao);
//                console.log($scope.entity.updatedAt);
                if ($scope.entity.dataDocumento && $scope.entity.dataDocumento.$invalid) {
                    var dataDoc = new Date($scope.entity.dataDocumento);
                    var dataConst = new Date($scope.entity.dataCostituicao);
                    var updatedAt = null;
                    if ($scope.entity.updatedAt)
                        updatedAt = new Date($scope.entity.updatedAt);

                    if (updatedAt == null && dataDoc >= dataConst)
                        $scope.entityForm.dataDocumento.$invalid = false;
                    else if (updatedAt != null && dataDoc <= updatedAt && dataDoc >= dataConst) {
                        $scope.entityForm.dataDocumento.$invalid = false;
                    } else
                        $scope.entityForm.dataDocumento.$invalid = true;
                }
            });
            $scope.$watch('entity.dataCostituicao', function () {
//                console.log($scope.entity.dataDocumento);
//                console.log($scope.entity.dataCostituicao);
//                console.log($scope.entity.updatedAt);
                if ($scope.entity.dataCostituicao && $scope.entity.dataCostituicao.$invalid) {
                    var dataConst = new Date($scope.entity.dataCostituicao);
                    var createdAt = new Date();
                    if ($scope.entity.createdAt)
                        createdAt = new Date($scope.entity.createdAt);

                    if (dataConst <= createdAt) {
                        $scope.entityForm.dataCostituicao.$invalid = false;
                    } else
                        $scope.entityForm.dataCostituicao.$invalid = true;
                }
            });

            function bulkDelete() {
//                console.log($scope.bulkSelect);
                var promises = [];

                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    if (item)
                        promises.push(EntityService.delete({id: $scope.entities[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.entities.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
