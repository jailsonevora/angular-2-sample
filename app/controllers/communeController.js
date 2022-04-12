angular.module("sgeApp").controller("CommuneController",
        function ($q, $scope, searchFilters, $route, $location,
                UtilsService, CommuneService, CountyService, ProvinceService, CountryService) {
//            console.log(FILTERS.entity);

            var APP = $scope.$parent.app;
            $scope.$parent.title = $route.current.title;
            $scope.labels = $scope.$parent.session.getLabels();

            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                commune: {},
                commercialBuilding: {}
            };
            $scope.counties = {};
            $scope.provinces = {};
            $scope.countries = {};
            $scope.communes = {};
            $scope.provincias = [];
            $scope.county = {};
            $scope.structures = {
                commune: UtilsService.tableStructure($scope.labels.communes)
            };

            $scope.activities = {};
            $scope.activities.secondary = [];
            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.commune,
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
            var route = {
                base: '/comunas',
                create: '/criar',
                edit: '/editar'
            };
            $scope.actions = {};
            $scope.pagination = {page: page};
            if ($location.path() == route.base +  route.create ) {
              CountryService.get().$promise.then(function (response) {
                  $scope.countries = response.content;
                  //console.log($scope.countries);
              });
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              CountryService.get().$promise.then(function (response) {
                  $scope.countries = response.content;
                  //console.log($scope.countries);
                  console.log($scope.$parent.savedStates);
                  $scope.commune = $scope.$parent.savedStates.commune;
                  $scope.display = $scope.$parent.savedStates.display;
              });
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.commune = $scope.$parent.savedStates.commune;
              $scope.display = $scope.$parent.savedStates.display;
            } else if ($location.path() == route.base) {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove
                };
                $scope.buttons = {
                    create: function(){$location.path(route.base +  route.create);},
                    remove: bulkDelete
                };
                CommuneService.get(queryDefaults).$promise.then(function (response) {
                    $scope.communes = response.content;
                    $scope.structures.commune = UtilsService.tableStructure($scope.labels.communes, $scope.communes[0]);
                    $scope.communes = UtilsService.applyReferences($scope.communes, $scope.structures.commune);
                    pagination(response);
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
                CommuneService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.communes = response.content;
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
                CommuneService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.communes = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'economicActivities') {
                    EconomicActivitiesService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.economicActivities;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchEconomicActivityChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    CommuneService.save($scope.commune,
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
                    CommuneService.update({id: $scope.commune.id}, $scope.commune,
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
                commune = $scope.communes[i];
                console.log(commune);
                $scope.commune = commune;
                $scope.display = {commune: {}};
            }

            function edit(i) {
              commune = $scope.communes[i];
              console.log(commune);
              display = {commune: {}};

              promises = {};
              promises.selectedCommune = CommuneService.get({id: commune.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.commune.codigo = data.selectedCommune.toJSON().codigo;
                  display.commune.designacao = data.selectedCommune.toJSON().designacao;
                  $scope.$parent.savedStates.commune = commune;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Comuna';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta comuna?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    var commune = $scope.communes[i];
                    CountyService.deleteCommune({id: commune.municipio.id, rid: commune.id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.communes.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }



            $scope.getProvinces = function (countryId, context) {
                CountryService.getProvinces({id: countryId}).$promise.then(function (response) {
                    $scope.provinces = response.content;
                    console.log("Province changed to:" + countryId + " " + $scope.provinces);
                });

            };
            $scope.getCounties = function (provinceId, context) {
                //provinceId = 6;
                ProvinceService.getCounties({id: provinceId}).$promise.then(function (response) {
                    $scope.counties = response.content;
//                    console.log($scope.countryResponse);
                });
            };
            $scope.getCommunes = function (countyId, context) {
                CountyService.getCommunes({id: countyId}).$promise.then(function (response) {
                    $scope.communes[context] = response.content;
//                    console.log(response.content);
                });
            };


            $scope.ordenarPor = function (campo) {

                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
            };

            function resetBulkSelect() {
                $scope.bulkSelect.all = false;
                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    $scope.bulkSelect.items[k] = false;
                });
            }
            $scope.$watch('bulkSelect.all', function () {
                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    $scope.bulkSelect.items[k] = $scope.bulkSelect.all;
                });
            });
            function bulkDelete() {
//                console.log($scope.bulkSelect);
                var promises = [];

                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    if (item)
                        promises.push(CommuneService.delete({id: $scope.communes[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.communes.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
