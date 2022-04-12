angular.module("sgeApp").controller("CompanyConditionController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, CompanyConditionService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;


            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                companyCondition: {},
                commercialBuilding: {}
            };
            $scope.companyCondition = {};
            $scope.companyConditions = {};
            $scope.structures = {
                companyCondition: UtilsService.tableStructure($scope.labels.companyConditions)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.companyCondition,
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
                base: '/situacao-empresa',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.companyCondition = $scope.$parent.savedStates.companyCondition;
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
                CompanyConditionService.get(queryDefaults).$promise.then(function (response) {
                    $scope.companyConditions = response.content;
                    $scope.structures.companyCondition = UtilsService.tableStructure($scope.labels.companyConditions, $scope.companyConditions[0]);
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
                CompanyConditionService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.companyConditions = response.content;
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
                CompanyConditionService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.companyConditions = response.content;
                    pagination(response);
                });
            }
            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'companyConditions') {
                    CompanyConditionService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.companyConditions;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchCompanyConditionChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    CompanyConditionService.save($scope.companyCondition,
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
                    CompanyConditionService.update({id: $scope.companyCondition.id}, $scope.companyCondition,
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
                companyCondition = $scope.companyConditions[i];
                console.log(companyCondition);
                $scope.companyCondition = companyCondition;
                $scope.display = {companyCondition: {}};
            }

            function edit(i) {
              companyCondition = $scope.companyConditions[i];
              console.log(companyCondition);
              display = {companyCondition: {}};

              promises = {};
              promises.selectedCompanyCondition = CompanyConditionService.get({id: companyCondition.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.companyCondition.designacao = data.selectedCompanyCondition.toJSON().designacao;
                  display.companyCondition.sta = data.selectedCompanyCondition.toJSON().sta;
                  $scope.$parent.savedStates.companyCondition = companyCondition;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Situação da Empresa';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta situação da empresa?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.companyConditions[i].id;
                    CompanyConditionService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.companyConditions.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.companyConditionModal = function () {
                CompanyConditionService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.companyCondition;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventCompanyConditionChosen';
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
                        promises.push(CompanyConditionService.delete({id: $scope.companyConditions[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.companyConditions.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
