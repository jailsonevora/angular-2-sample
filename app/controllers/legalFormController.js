angular.module("sgeApp").controller("LegalFormController",
        function ($q, $scope, $route,  searchFilters, $location, LegalFormService, UtilsService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;
            $scope.labels = $scope.$parent.session.getLabels();
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                legalForm: {},
                commercialBuilding: {}
            };
            $scope.legalForm = {};
            $scope.legalForms = {};
            $scope.structures = {
                legalForm: UtilsService.tableStructure($scope.labels.legalForm)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.legalForm,
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
                base: '/formas-juridicas',
                create: '/criar',
                edit: '/editar'
            };

            // if ($location.path() == route.base +  route.create || $location.path() == route.base +  route.edit) {
            //
            // } else
              if ($location.path() == route.base +  route.create) {
                $scope.page = 'create';
              }else if ($location.path() == route.base +  route.edit) {
                $scope.page = 'edit';
                console.log($scope.$parent.savedStates);
                $scope.legalForm = $scope.$parent.savedStates.legalForm;
                $scope.display = $scope.$parent.savedStates.display;
              }else if ($location.path() == route.base) {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove
                };
                $scope.buttons = {
                    create: function(){$location.path(route.base +  route.create);},
                    remove: bulkDelete
                };
                LegalFormService.get(queryDefaults).$promise.then(function (response) {
                    $scope.legalForms = response.content;
                    $scope.structures.legalForm = UtilsService.tableStructure($scope.labels.legalForm, $scope.legalForms[0]);
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
                LegalFormService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.legalForms = response.content;
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
                LegalFormService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.legalForms = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'legalForms') {
                    LegalFormService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.legalForms;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchLegalFormChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    LegalFormService.save($scope.legalForm,
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
                    LegalFormService.update({id: $scope.legalForm.id}, $scope.legalForm,
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
                legalForm = $scope.legalForms[i];
                console.log(legalForm);
                $scope.legalForm = legalForm;
                $scope.display = {legalForm: {}};

            }

            function edit(i) {
              legalForm = $scope.legalForms[i];
              console.log(legalForm);
              display = {legalForm: {}};

              promises = {};
              promises.selectedLegalForm = LegalFormService.get({id: legalForm.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.legalForm.formaJuridica = data.selectedLegalForm.toJSON().formaJuridica;
                  display.legalForm.fjr = data.selectedLegalForm.toJSON().fjr;
                  $scope.$parent.savedStates.legalForm = legalForm;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Forma Jurídica';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta forma jurídica?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.legalForms[i].id;
                    LegalFormService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.legalForms.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.LegalFormModal = function () {
                LegalFormService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.legalForm;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventLegalFormChosen';
                    $scope.$parent.generic.modal.checkedData = [];
                    $scope.$parent.generic.modal.show();
                    console.log(response.content);
                });
            };
            $scope.ordenarPor = function (campo) {

                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
            };

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
                        promises.push(LegalFormService.delete({id: $scope.legalForms[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.legalForms.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
