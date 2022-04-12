angular.module("sgeApp").controller("ProvinceController",
        function ($q, $scope, searchFilters, $route, $location,
                UtilsService, CountyService, ProvinceService, CountryService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;
            $scope.$parent.title = $route.current.title;
            $scope.labels = $scope.$parent.session.getLabels();

            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                province: {},
                commercialBuilding: {}
            };
            $scope.countries = {};
            $scope.communes = {};
            $scope.provincias = [];
            $scope.province = {};
            $scope.provinces = {};
            $scope.structures = {
                province: UtilsService.tableStructure($scope.labels.provinces)
            };

            $scope.activities = {};
            $scope.activities.secondary = [];
            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.province,
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
                base: '/provincias',
                create: '/criar',
                edit: '/editar'
            };
            $scope.actions = {};
            $scope.pagination = {page: page};
            var route = {
                base: '/provincias',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base + route.create) {
                $scope.page = 'create';
                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                    //console.log($scope.countries);
                });

            } else if ($location.path() == route.base + route.edit) {
                $scope.page = 'edit';
                console.log($scope.$parent.savedStates);
                $scope.province = $scope.$parent.savedStates.province;
                $scope.display = $scope.$parent.savedStates.display;
                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                    //console.log($scope.countries);
                });
                      console.log($scope.$parent.savedStates);
                      $scope.province = $scope.$parent.savedStates.province;
                      $scope.display = $scope.$parent.savedStates.display;

            } else if ($location.path() == route.base) {
                $scope.actions = {
                    view: view,
                    edit: edit,
                    remove: remove
                };
                $scope.buttons = {
                    create: function () {
                        $location.path(route.base + route.create);
                    },
                    remove: bulkDelete
                };
                ProvinceService.get(queryDefaults).$promise.then(function (response) {
                    $scope.provinces = response.content;
                    $scope.structures.province = UtilsService.tableStructure($scope.labels.provinces, $scope.provinces[0]);
                    $scope.provinces = UtilsService.applyReferences($scope.provinces, $scope.structures.province);
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
                ProvinceService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.provinces = response.content;
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
                ProvinceService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.provinces = response.content;
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
                console.log($scope.province);
                if (context == 'create')
                CountryService.saveProvince({id: $scope.province.paisid}, $scope.province,
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
                        }
                );
                if (context == 'edit')
                console.log("Edit Context");
                  ProvinceService.update({id: $scope.province.id}, $scope.province,
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
                province = $scope.provinces[i];
                console.log(province);
                $scope.province = province;
                $scope.display = {province: {}};

            }

            function edit(i) {
              province = $scope.provinces[i];
              console.log(province);
              display = {province: {}};

              promises = {};
              promises.selectedProvince = ProvinceService.get({id: province.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.province.codigo = data.selectedProvince.toJSON().codigo;
                  display.province.designacao = data.selectedProvince.toJSON().designacao;
                  $scope.$parent.savedStates.province = province;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Província';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover esta província?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    var province = $scope.provinces[i];
                    CountryService.deleteProvince({id: province.pais.id, rid: province.id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.provinces.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
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
                        promises.push(ProvinceService.delete({id: $scope.provinces[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.provinces.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
