angular.module("sgeApp").controller("FunctionTypeController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, EmployeeTypeService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;


            $scope.labels = $scope.$parent.session.getLabels();
            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                employType: {},
                commercialBuilding: {}
            };
            $scope.employType = {};
            $scope.employTypes = {};
            $scope.structures = {
                employType: UtilsService.tableStructure($scope.labels.employType)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.employType,
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
                base: '/tipo-funcionarios',
                create: '/criar',
                edit: '/editar'
            };
            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.employType = $scope.$parent.savedStates.employType;
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
                EmployeeTypeService.get(queryDefaults).$promise.then(function (response) {
                    $scope.employTypes = response.content;
                    $scope.structures.employType = UtilsService.tableStructure($scope.labels.employType, $scope.employTypes[0]);
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
                EmployeeTypeService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.employTypes = response.content;
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
                EmployeeTypeService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.employTypes = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'economicActivities') {
                    EmployeeTypeService.get().$promise.then(function (response) {
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
                    EmployeeTypeService.save($scope.employType,
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
                    EmployeeTypeService.update({id: $scope.employType.id}, $scope.employType,
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
                employType = $scope.employTypes[i];
                console.log(employType);
                $scope.employType = employType;
                $scope.display = {employType: {}};
            }

            function edit(i) {
              employType = $scope.employTypes[i];
              console.log(employType);
              display = {employType: {}};

              promises = {};
              promises.selectedEmployType = EmployeeTypeService.get({id: employType.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.employType.tipo = data.selectedEmployType.toJSON().tipo;
                  $scope.$parent.savedStates.employType = employType;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Tipo de Função';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este tipo de função?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.employTypes[i].id;
                    EmployeeTypeService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.employTypes.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }
            $scope.employTypeModal = function () {
                EmployeeTypeService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.employType;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventEmployTypeChosen';
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
                        promises.push(EmployeeTypeService.delete({id: $scope.employTypes[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.employTypes.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
