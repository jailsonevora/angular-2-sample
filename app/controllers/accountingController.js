angular.module("sgeApp").controller("AccountingController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, AccountingService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;
            $scope.$parent.title = $route.current.title;
            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                accounting: {},
                commercialBuilding: {}
            };
            $scope.accounting = {};
            $scope.accountings = {};
            $scope.structures = {
                accounting: UtilsService.tableStructure($scope.labels.accountings)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.accounting,
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
                base: '/contabilidade',
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
              $scope.accounting = $scope.$parent.savedStates.accounting;
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
                AccountingService.get(queryDefaults).$promise.then(function (response) {
                    $scope.accountings = response.content;
                    $scope.structures.accounting = UtilsService.tableStructure($scope.labels.accountings, $scope.accountings[0]);
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
                AccountingService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.accountings = response.content;
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
                AccountingService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.accountings = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'commercialActivities') {
                    AccountingService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.accountings;
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
                    AccountingService.save($scope.accounting,
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
                    AccountingService.update({id: $scope.accounting.id}, $scope.accounting,
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
                accounting = $scope.accountings[i];
                console.log(accounting);
                $scope.accounting = accounting;
                $scope.display = {accounting: {}};
            }

            function edit(i) {
              accounting = $scope.accountings[i];
              console.log(accounting);
              display = {accounting: {}};

              promises = {};
              promises.selectedAccounting = AccountingService.get({id: accounting.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.accounting.cnta = data.selectedAccounting.toJSON().cnta;
                  display.accounting.cntaDsg = data.selectedAccounting.toJSON().cntaDsg;
                  $scope.$parent.savedStates.accounting = accounting;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Contabilidade';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este item de contabilidade?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.accountings[i].id;
                    AccountingService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.accountings.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }
            $scope.accountingModal = function () {
                AccountingService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.accounting;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventAccountingChosen';
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
                        promises.push(AccountingService.delete({id: $scope.accountings[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.accountings.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
