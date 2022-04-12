angular.module("sgeApp").controller("SectorController",
        function ($q, $scope, $route, searchFilters, $location,
                UtilsService, EconomicSectorService) {
//            console.log(FILTERS.entity);

            var APP = $scope.$parent.app;
            $scope.$parent.title = $route.current.title;
            $scope.labels = $scope.$parent.session.getLabels();

            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                economicSector: {},
                commercialBuilding: {}
            };

            $scope.economicSector = {};
            $scope.economicSectors = {};
            $scope.structures = {
                economicSector: UtilsService.tableStructure($scope.labels.economicSector)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.economicSector,
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
                base: '/sectores',
                create: '/criar',
                edit: '/editar'
            };
            $scope.actions = {};
            $scope.pagination = {page: page};

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.economicSector = $scope.$parent.savedStates.economicSector;
              $scope.display = $scope.$parent.savedStates.display;
            } else if ($location.path() == route.base) {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove
                };
                $scope.buttons = {
                    create: function(){
                      $location.path(route.base +  route.create);
                    },
                    remove: bulkDelete
                };
                EconomicSectorService.get(queryDefaults).$promise.then(function (response) {
                    $scope.economicSectors = response.content;
                    $scope.structures.economicSector = UtilsService.tableStructure($scope.labels.economicSector, $scope.economicSectors[0]);
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
                EconomicSectorService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.economicSectors = response.content;
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
                EconomicSectorService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.economicSectors = response.content;
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
                    EconomicSectorService.save($scope.economicSector,
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
                    EconomicSectorService.update({id: $scope.economicSector.id}, $scope.economicSector,
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
                economicSector = $scope.economicSectors[i];
                console.log(economicSector);
                $scope.economicSector = economicSector;
                $scope.display = {economicSector: {}};

            }

            function edit(i) {
              economicSector = $scope.economicSectors[i];
              console.log(economicSector);
              display = {economicSector: {}};

              promises = {};
              promises.selectedSector = EconomicSectorService.get({id: economicSector.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.economicSector.sector = data.selectedSector.toJSON().sector;
                  display.economicSector.sectorDsg = data.selectedSector.toJSON().sectorDsg;
                  $scope.$parent.savedStates.economicSector = economicSector;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Sector Económico';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este sector económico?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.economicSectors[i].id;
                    EconomicSectorService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.economicSectors.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.economicSectorModal = function () {
                EconomicSectorService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.economicSector;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventEconomicSectorChosen';
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.show();
                    console.log(response.content);
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
//              console.log($scope.bulkSelect);
                var promises = [];

                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    if (item)
                        promises.push(EconomicSectorService.delete({id: $scope.economicSectors[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.economicSectors.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
