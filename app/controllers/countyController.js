angular.module("sgeApp").controller("CountyController",
        function ($q, $scope, $route, searchFilters, $location,
                UtilsService, CountyService, ProvinceService, CountryService) {

            var APP = $scope.$parent.app;

            $scope.labels = $scope.$parent.session.getLabels();
            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                county: {},
                commercialBuilding: {}
            };
            $scope.provinces = {};
            $scope.countries = {};
            $scope.communes = {};
            $scope.provincias = [];
            $scope.county = {};
            $scope.counties = {};
            $scope.structures = {
                county: UtilsService.tableStructure($scope.labels.counties)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.county,
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
                base: '/municipios',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base + route.create) {
                $scope.page = 'create';
                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                });
                ProvinceService.get().$promise.then(function (response) {
                    $scope.provinces = response.content;
                });

              } else if ($location.path() == route.base + route.edit) {
                CountryService.get().$promise.then(function (response) {
                    $scope.countries = response.content;
                });
                ProvinceService.get().$promise.then(function (response) {
                    $scope.provinces = response.content;
                });
                console.log($scope.$parent.savedStates);
                $scope.county = $scope.$parent.savedStates.county;
                $scope.display = $scope.$parent.savedStates.display;
                $scope.page = 'edit';
                console.log($scope.$parent.savedStates);
                $scope.county = $scope.$parent.savedStates.county;
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
                CountyService.get(queryDefaults).$promise.then(function (response) {
                    $scope.counties = response.content;
                    $scope.structures.county = UtilsService.tableStructure($scope.labels.counties, $scope.counties[0]);
                    $scope.counties = UtilsService.applyReferences($scope.counties, $scope.structures.county);
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
                CountyService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.counties = response.content;
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
                CountyService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.counties = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'counties') {
                    CountyService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.counties;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchCountyChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }
            $scope.create = function (context) {
                console.log(this.county);
                if (context == 'create')
                  ProvinceService.saveCounty({id: $scope.county.provinciaid}, $scope.county,
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
                  CountyService.update({id: $scope.county.id}, $scope.county,
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
                county = $scope.counties[i];
                console.log(county);
                $scope.county = county;
                $scope.display = {county: {}};
            }

            function edit(i) {
              county = $scope.counties[i];
              console.log(county);
              display = {county: {}};

              promises = {};
              promises.selectedCounty = CountyService.get({id: county.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.county.codigo = data.selectedCounty.toJSON().codigo;
                  display.county.designacao = data.selectedCounty.toJSON().designacao;
                  display.county.sigla = data.selectedCounty.toJSON().sigla;
                  $scope.$parent.savedStates.county = county;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Município';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este município?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    var county = $scope.counties[i];
                    ProvinceService.deleteCounty({id: county.provincia.id, rid: county.id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.counties.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.getProvinces = function (countryId, context) {
                CountryService.getProvinces({id: countryId}).$promise.then(function (response) {
                    $scope.provinces = response.content;
                    //console.log("Province changed to:" + countryId + " " + $scope.provinces);

                });

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
                        promises.push(CountyService.delete({id: $scope.counties[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.counties.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
