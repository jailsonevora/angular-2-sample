angular.module("sgeApp").controller("CountryController",
        function ($q, $scope, $route, searchFilters, $location,
                UtilsService, CountryService) {

            var APP = $scope.$parent.app;

            $scope.labels = $scope.$parent.session.getLabels();

            $scope.paises = [];
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                country: {},
                commercialBuilding: {}
            };
            $scope.counties = {};
            $scope.provinces = {};
            $scope.countries = {};
            $scope.provincias = [];
            $scope.county = {};
            $scope.counties = {};
            $scope.structures = {
                country: UtilsService.tableStructure($scope.labels.countries)
            };
            $scope.activities = {};
            $scope.activities.secondary = [];
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
                base: '/paises',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create ) {
              CountryService.get().$promise.then(function (response) {
                  $scope.countries = response.content;
                  //console.log($scope.countries);
              });
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              CountryService.get().$promise.then(function (response) {
                  $scope.countries = response.content;
                  //console.log($scope.countries);
                  console.log($scope.$parent.savedStates);
                  $scope.country = $scope.$parent.savedStates.country;
                  $scope.display = $scope.$parent.savedStates.display;
              });
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.country = $scope.$parent.savedStates.country;
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
                CountryService.get(queryDefaults).$promise.then(function (response) {
                    $scope.countries = response.content;
                    $scope.structures.country = UtilsService.tableStructure($scope.labels.countries, $scope.countries[0]);
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
                CountryService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.countries = response.content;
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
                CountryService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.countries = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'economicActivities') {
                    CountryService.get().$promise.then(function (response) {
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
                    CountryService.save($scope.country,
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
                    CountryService.update({id: $scope.country.id}, $scope.country,
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
                country = $scope.countries[i];
                console.log(country);
                $scope.country = country;
                $scope.display = {country: {}};
            }

            function edit(i) {
              country = $scope.countries[i];
              console.log(country);
              display = {country: {}};

              promises = {};
              promises.selectedCountry = CountryService.get({id: country.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.country.pais = data.selectedCountry.toJSON().pais;
                  $scope.$parent.savedStates.country = country;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover País';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este país?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.countries[i].id;
                    CountryService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.countries.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }


            $scope.getProvinces = function (countryId, context) {
                CountryService.getProvinces({id: countryId}).$promise.then(function (response) {
                    $scope.provinces[context] = response.content;
//                    console.log(response.content);
                });

            };
            $scope.getCounties = function (provinceId, context) {
                ProvinceService.getCounties({id: provinceId}).$promise.then(function (response) {
                    $scope.counties[context] = response.content;
//                    console.log($scope.countryResponse);
                });
            };
            $scope.getCommunes = function (countyId, context) {
                CountyService.getCommunes({id: countyId}).$promise.then(function (response) {
                    $scope.communes[context] = response.content;
//                    console.log(response.content);
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
            //                console.log($scope.bulkSelect);
                var promises = [];

                angular.forEach($scope.bulkSelect.items, function (item, k) {
                    if (item)
                        promises.push(CountryService.delete({id: $scope.countries[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.countries.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
