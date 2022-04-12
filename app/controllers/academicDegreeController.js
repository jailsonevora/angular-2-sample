angular.module("sgeApp").controller("AcademicDegreeController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, AcademicDegreeService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;

            $scope.labels = $scope.$parent.session.getLabels();
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                academicDegree: {},
                commercialBuilding: {}
            };
            $scope.academicDegree = {};
            $scope.academicDegrees = {};
            $scope.structures = {
                academicDegree: UtilsService.tableStructure($scope.labels.academicDegrees)
            };

            $scope.activities = {};
            $scope.activities.secondary = [];
            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.academicDegree,
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
                base: '/titulos-academicos',
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
              $scope.academicDegree = $scope.$parent.savedStates.academicDegree;
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
                AcademicDegreeService.get(queryDefaults).$promise.then(function (response) {
                    $scope.academicDegrees = response.content;
                    $scope.structures.academicDegree = UtilsService.tableStructure($scope.labels.academicDegrees, $scope.academicDegrees[0]);
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
                AcademicDegreeService.get({params: queryStr}).$promise.then(function (response) {
                    $scope.academicDegrees = response.content;
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
                AcademicDegreeService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.academicDegrees = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'academicDegrees') {
                    AcademicDegreeService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.academicDegrees;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchCommercialActivitiesChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            // $scope.create = function () {
            //     //this.commercialActivity.naturalId = "hh";
            //     console.log(this.academicDegree);
            //     AcademicDegreeService.save(this.academicDegree);
            // };
            $scope.create = function (context) {
                if (context == 'create')
                    AcademicDegreeService.save($scope.academicDegree,
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
                    AcademicDegreeService.update({id: $scope.academicDegree.id}, $scope.academicDegree,
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
                academicDegree = $scope.academicDegrees[i];
                console.log(academicDegree);
                $scope.academicDegree = academicDegree;
                $scope.display = {academicDegree: {}};
            }

            function edit(i) {
              academicDegree = $scope.academicDegrees[i];
              console.log(academicDegree);
              display = {academicDegree: {}};

              promises = {};
              promises.selectedAcademicDegree = AcademicDegreeService.get({id: academicDegree.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.academicDegree.titulo = data.selectedAcademicDegree.toJSON().titulo;
                  $scope.$parent.savedStates.academicDegree = academicDegree;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

              });
            }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Título Académico';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este título académico?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.academicDegrees[i].id;
                    AcademicDegreeService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.academicDegrees.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.academicDegreeModal = function () {
                AcademicDegreeService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.academicDegree;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventacademicDegreeChosen';
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
                        promises.push(AcademicDegreeService.delete({id: $scope.academicDegrees[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.academicDegrees.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
