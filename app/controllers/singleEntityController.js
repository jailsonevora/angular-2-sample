angular.module("sgeApp").controller("SingleEntityController",
        function ($q, $scope, $route,  searchFilters, $location, AcademicDegreeService,
                EconomicActivitiesService, EntityService, ReceptionChannelService,
                UtilsService, EmployeeTypeService, CommercialActivityService, OriginDocService,
                GenderService, ProvinceService, CountryService, CountyService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;

            
            $scope.labels = $scope.$parent.session.getLabels();

            $scope.paises = [];
            $scope.bulkSelect = [];
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
                tipoEntidade: {id: 54}
            };

            $scope.entity.cae = [];
            $scope.entity.estabelecimento = [];
            $scope.entity.socio = [];
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
                scheme: searchFilters.country,
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
            $scope.pagination = {page: page};
            $scope.gender = {};
            $scope.actions = {};
            $scope.buttons = {};
            var route = {
                base: $route.current.base ? $route.current.base : '/entidades-individuais',
                create: '/criar',
                edit: '/editar',
                renew: '/renovar'
            };

            if ($route.current.name == 'create' || $route.current.name == 'edit' || $route.current.name == 'renew') {
                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                    //console.log($scope.countries);
                });
                EmployeeTypeService.get().$promise.then(function (response) {
                    $scope.employeeType = response.content;
                });
                ReceptionChannelService.get().$promise.then(function (response) {
                    $scope.receptionChannel = response.content;
                });
                GenderService.get().$promise.then(function (response) {
                    $scope.gender = response.content;
                });
                if (($route.current.name == 'edit' || $route.current.name == 'renew')
                        && !angular.equals($scope.$parent.savedStates, {})) {
                    $scope.page = 'edit';
                    console.log($scope.$parent.savedStates);
                    $scope.entity = $scope.$parent.savedStates.entity;
                    $scope.display = $scope.$parent.savedStates.display;
                    if ($route.current.name == 'renew') {
                        $scope.page = 'renew';
                        $scope.entityOld = angular.copy($scope.entity);
                        $scope.displayOld = angular.copy($scope.display);
                    }
                }

            } else if ($route.current.name == 'list' || $route.current.name == 'aproved'
                    || $route.current.name == 'to-aprove') {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove,
                    custom: {
//                        renewal: {i: 'ion-android-note', fn: renewal}
                    }
                };
                $scope.buttons = {
                    create: function () {
                        $location.path(route.base + route.create);
                    },
                    remove: bulkDelete
                };

                if ($route.current.name == 'aproved'){
                    EntityService.getSingleApproved(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                } else if ($route.current.name == 'to-aprove') {
                    $scope.actions.custom = {
//                        validate: {i: 'ion-checkmark-round', fn: validate}
                    };
                    EntityService.getSingleToApprove(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                } else {
                    EntityService.getSingle(queryDefaults).$promise.then(function (response) {
                        $scope.entities = response.content;
                        $scope.structures.entity = UtilsService.tableStructure($scope.labels.entities, $scope.entities[0]);
                        pagination(response);
                    });
                }
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
                    $scope.searchFilters.query.sort = col+',asc';
                    
                } else {
                    $scope.searchFilters.query.sort = col+',desc';
                    
                }
                $scope.searchFilters.query.page = queryDefaults.page;
                searchFilterSubmit(false);
            }

            function searchFilterSubmit(requery = true) {
                if (requery) {
                    $scope.searchFilters.query = UtilsService.getQueryObj($scope.searchFilters.values);
                    $scope.searchFilters.query.size = queryDefaults.size;
                }
                EntityService.getSingle($scope.searchFilters.query).$promise.then(function (response) {
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
//                console.log(context);
//                console.log($scope.entity);
                if (context == null)
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
                else if (context == 'edit')
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
            };

            function view(i) {
                $('#detail-modal').modal('show');
                entity = $scope.entities[i];
                console.log(entity);
                $scope.entity = entity;
                $scope.display = {entity: {}};

                promises = {};
                promises.originDoc = OriginDocService.get({id: entity.origemDoc}).$promise;
                promises.economicActivity = EconomicActivitiesService.get({id: entity.actiEcoPrincipal}).$promise;
                promises.commercialActivity = CommercialActivityService.get({id: entity.actiComercial}).$promise;
                promises.economicSector = EconomicSectorService.get({id: entity.sector}).$promise;
                promises.country = CountryService.get({id: entity.contacto.pais}).$promise;
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
                    $scope.display.entity.tipo = data.employeeType.toJSON().tipo;
                    $scope.display.entity.formaJuridica = data.legalForm.toJSON().formaJuridica;
                    $scope.display.entity.canal = data.receptionChannel.toJSON().canal;
                    $scope.display.entity.situacaoEmpresa = data.condition.toJSON().designacao;
                    $scope.display.entity.contabilidade = data.accounting.toJSON().cntaDsg;
                });
            }

            function edit(i) {
                entity = $scope.entities[i];
                console.log(entity);
                display = {entity: {}};
                display.entity.dataDocumento = UtilsService.dateDisplay(entity.dataDocumento, 'yyyy-mm-dd');
                display.entity.data_constituicao = UtilsService.dateDisplay(entity.data_constituicao, 'yyyy-mm-dd');

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
                    $scope.$parent.savedStates.entity = entity;
                    $scope.$parent.savedStates.display = display;

                    $location.path(route.base + route.edit);
                });
            }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Entidade';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta entidade?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.entities[i].id;
                    EntityService.delete({id: id}).$promise.then(function (response) {
                        // TODO: TO BE CONTINUED, HANGLE SUCCESS AND ERROR
                        console.log(response);
                    });
                    $scope.entities.splice(i, 1);
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
            function primaryActivityChosen (data) {
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
                $('#commercial-building-form-modal').modal('show');
            };
            $scope.businessPartnerFormModal = function () {
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
            $scope.getProvinces = function (countryId, context) {
                CountryService.getProvinces({id: countryId}).$promise.then(function (response) {
                    $scope.provinces[context] = response.content;
//                    console.log(response.content);
                });

            };
            $scope.getCounties = function (provinceId, context) {
                ProvinceService.getCounties({id: provinceId}).$promise.then(function (response) {
                    $scope.counties[context] = response.content;
//                    console.log($scope.countryResponse);
                });
            };
            $scope.getCommunes = function (countyId, context) {
                CountyService.getCommunes({id: countyId}).$promise.then(function (response) {
                    $scope.communes[context] = response.content;
//                    console.log(response.content);
                });
            };

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
            $scope.academicDegreeModal = function () {
                AcademicDegreeService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.academicDegree;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.select = academicDegreeChosen;
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.show();
//                    console.log(response.content);
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
                $scope.entity.socio.push($scope.businessPartner);
                $scope.businessPartner = UtilsService.tableStructure($scope.labels.businessPartner);
                $('#business-partner-form-modal').modal('hide');
            };
            $scope.addCommercialBuilding = function () {
                $scope.entity.estabelecimento.push($scope.commercialBuilding);
//                console.log($scope.entity);
                $scope.commercialBuilding = UtilsService.tableStructure($scope.labels.commercialBuilding);
                $scope.commercialBuilding.cae = [];
                $('#commercial-building-form-modal').modal('hide');
            };

            function bulkDelete(posArr) {
//                console.log(posArr);
                for (var i = posArr.length - 1; i >= 0; i--) {
                    if (posArr[i]) {
                        $scope.entidades.splice(i, 1);
                        $scope.bulkSelect.splice(i, 1);
                    }
                }

            }
            ;

        });
