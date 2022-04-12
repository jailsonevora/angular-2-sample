angular.module("sgeApp").controller("EconomicActivityController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, EconomicActivitiesService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;
            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                economicActivity: {},
                commercialBuilding: {}
            };
            $scope.economicActivity = {};
            $scope.economicActivities = {};
            $scope.structures = {
                economicActivity: UtilsService.tableStructure($scope.labels.economicActivities)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.economicActivity,
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
            var route = {
                base: '/actividade-economica',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.economicActivity = $scope.$parent.savedStates.economicActivity;
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
                EconomicActivitiesService.get(queryDefaults).$promise.then(function (response) {
                    $scope.economicActivities = response.content;
                    $scope.structures.economicActivity = UtilsService.tableStructure($scope.labels.economicActivities, $scope.economicActivities[0]);
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
                EconomicActivitiesService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.economicActivities = response.content;
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
                EconomicActivitiesService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.economicActivities = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'economicActivities') {
                    EconomicActivitiesService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.economicActivities;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchEconomicActivitiesChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    EconomicActivitiesService.save($scope.economicActivity,
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
                    EconomicActivitiesService.update({id: $scope.economicActivity.id}, $scope.economicActivity,
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
                economicActivity = $scope.economicActivities[i];
                console.log(economicActivity);
                $scope.economicActivity = economicActivity;
                $scope.display = {economicActivity: {}};
            }

            function edit(i) {
              economicActivity = $scope.economicActivities[i];
              console.log(economicActivity);
              display = {economicActivity: {}};

              promises = {};
              promises.selectedEconomicActivity = EconomicActivitiesService.get({id: economicActivity.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.economicActivity.className = data.selectedEconomicActivity.toJSON().className;
                  display.economicActivity.cae = data.selectedEconomicActivity.toJSON().cae;
                  display.economicActivity.designacao = data.selectedEconomicActivity.toJSON().designacao;
                  $scope.$parent.savedStates.economicActivity = economicActivity;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Actividade Económica]';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta actividade económica?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.economicActivities[i].id;
                    EconomicActivitiesService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.economicActivities.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.economicActivityModal = function () {
                EconomicActivitiesService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.economicActivity;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventEconomicActivityChosen';
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
                        promises.push(EconomicActivitiesService.delete({id: $scope.economicActivities[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.economicActivities.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
