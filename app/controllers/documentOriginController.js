angular.module("sgeApp").controller("DocumentOriginController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, OriginDocService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;


            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                originDoc: {},
                commercialBuilding: {}
            };
            $scope.originDoc = {};
            $scope.originDocs = {};
            $scope.structures = {
                originDoc: UtilsService.tableStructure($scope.labels.originDocs)
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
            $scope.actions = {};
            $scope.pagination = {page: page};
            var route = {
                base: '/origens-documento',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.originDoc = $scope.$parent.savedStates.originDoc;
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
                OriginDocService.get(queryDefaults).$promise.then(function (response) {
                    $scope.originDocs = response.content;
                    $scope.structures.originDoc = UtilsService.tableStructure($scope.labels.originDocs, $scope.originDocs[0]);
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
                OriginDocService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.originDocs = response.content;
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
                OriginDocService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.originDocs = response.content;
                    pagination(response);
                });
            }


            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'originDocs') {
                    OriginDocService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.originDocs;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchOriginDocsChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    OriginDocService.save($scope.originDoc,
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
                    OriginDocService.update({id: $scope.originDoc.id}, $scope.originDoc,
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
                originDoc = $scope.originDocs[i];
                console.log(originDoc);
                $scope.originDoc = originDoc;
                $scope.display = {originDoc: {}};
            }

            function edit(i) {
              originDoc = $scope.originDocs[i];
              console.log(originDoc);
              display = {originDoc: {}};

              promises = {};
              promises.selectedOriginDoc = OriginDocService.get({id: originDoc.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.originDoc.origem = data.selectedOriginDoc.toJSON().origem;
                  display.originDoc.origemDsg = data.selectedOriginDoc.toJSON().origemDsg;
                  $scope.$parent.savedStates.originDoc = originDoc;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Origem de Documento';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este indicador de origem de documento?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.originDocs[i].id;
                    OriginDocService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.originDocs.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.originDocModal = function () {
                OriginDocService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.originDoc;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventoriginDocChosen';
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
                        promises.push(OriginDocService.delete({id: $scope.originDocs[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.originDocs.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
