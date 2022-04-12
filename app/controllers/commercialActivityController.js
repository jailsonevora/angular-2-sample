angular.module("sgeApp").controller("CommercialActivityController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, CommercialActivityService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;

            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                commercialActivity: {},
                commercialBuilding: {}
            };
            $scope.commercialActivity = {};
            $scope.commercialActivities = {};
            $scope.structures = {
                commercialActivity: UtilsService.tableStructure($scope.labels.commercialActivities)
            };

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
            var route = {
                base: '/actividades-comerciais',
                create: '/criar',
                edit: '/editar'
            };
            $scope.actions = {};
            $scope.pagination = {page: page};
            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit && !angular.equals($scope.$parent.savedStates, {})) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.commercialActivity = $scope.$parent.savedStates.commercialActivity;
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
                CommercialActivityService.get(queryDefaults).$promise.then(function (response) {
                    $scope.commercialActivities = response.content;
                    $scope.structures.commercialActivity = UtilsService.tableStructure($scope.labels.commercialActivities, $scope.commercialActivities[0]);
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
                CommercialActivityService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.commercialActivities = response.content;
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
                CommercialActivityService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.commercialActivities = response.content;
                    pagination(response);
                });
            }
            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'commercialActivities') {
                    CommercialActivityService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.commercialActivities;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchCommercialActivitiesChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    CommercialActivityService.save($scope.commercialActivity,
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
                    CommercialActivityService.update({id: $scope.commercialActivity.id}, $scope.commercialActivity,
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
                commercialActivity = $scope.commercialActivities[i];
                console.log(commercialActivity);
                $scope.commercialActivity = commercialActivity;
                $scope.display = {commercialActivity: {}};
            }

            function edit(i) {
              commercialActivity = $scope.commercialActivities[i];
              console.log(commercialActivity);
              display = {commercialActivity: {}};

              promises = {};
              promises.selectedCommercialActivity = CommercialActivityService.get({id: commercialActivity.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.commercialActivity.cac = data.selectedCommercialActivity.toJSON().cac;
                  display.commercialActivity.cacDsg = data.selectedCommercialActivity.toJSON().cacDsg;
                  $scope.$parent.savedStates.commercialActivity = commercialActivity;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

              });
            }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Actividade Comercial';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta actividade comercial?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.commercialActivities[i].id;
                    CommercialActivityService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.commercialActivities.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.commercialActivityModal = function () {
                CommercialActivityService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.commercialActivity;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventCommercialActivityChosen';
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
//                console.log($scope.bulkSelect);
                var promises = [];

                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    if (item)
                        promises.push(CommercialActivityService.delete({id: $scope.commercialActivities[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.commercialActivities.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
