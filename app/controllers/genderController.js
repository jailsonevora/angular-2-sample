angular.module("sgeApp").controller("GenderController",
        function ($q, $scope, $route,  searchFilters, $location,
                UtilsService, GenderService) {
//            console.log(FILTERS.entity);
console.log("COntroller invoked - Gender");
            var APP = $scope.$parent.app;


            $scope.labels = $scope.$parent.session.getLabels();
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                gender: {},
                commercialBuilding: {}
            };
            $scope.gender = {};
            $scope.genders = {};
            $scope.structures = {
                gender: UtilsService.tableStructure($scope.labels.genders)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.gender,
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
                base: '/generos',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.gender = $scope.$parent.savedStates.gender;
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
                GenderService.get(queryDefaults).$promise.then(function (response) {
                    $scope.genders = response.content;
                    $scope.structures.gender = UtilsService.tableStructure($scope.labels.genders, $scope.genders[0]);
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
                GenderService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.genders = response.content;
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
                GenderService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.genders = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'commercialActivities') {
                    GenderService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.genders;
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
                    GenderService.save($scope.gender,
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
                    GenderService.update({id: $scope.gender.id}, $scope.gender,
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
                gender = $scope.genders[i];
                console.log(gender);
                $scope.gender = gender;
                $scope.display = {gender: {}};
            }

            function edit(i) {
              gender = $scope.genders[i];
              console.log(gender);
              display = {gender: {}};

              promises = {};
              promises.selectedGender = GenderService.get({id: gender.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.gender.sexo = data.selectedGender.toJSON().sexo;
                  $scope.$parent.savedStates.gender = gender;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
                $scope.$parent.generic.dialog.title = 'Remover Gênero';
                $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este gênero?';
                $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.genders[i].id;
                    GenderService.delete({id: id}).$promise.then(function (response) {
                        // TODO: TO BE CONTINUED, HANGLE SUCCESS AND ERROR
                        console.log(response);
                    });
                    $scope.genders.splice(i, 1);
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.genderModal = function () {
                GenderService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.gender;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventgenderChosen';
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
                        promises.push(GenderService.delete({id: $scope.genders[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.genders.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
