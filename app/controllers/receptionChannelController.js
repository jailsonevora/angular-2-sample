angular.module("sgeApp").controller("ReceptionChannelController",
        function ($q, $scope, $route, searchFilters, $location,
                UtilsService, ReceptionChannelService) {
//            console.log(FILTERS.entity);
            var APP = $scope.$parent.app;


            $scope.labels = $scope.$parent.session.getLabels();
            //$scope.app = "Lista das actividades comerciais";
            $scope.bulkSelect = {all: false, items: []};
            $scope.display = {
                receptionChannel: {},
                commercialBuilding: {}
            };
            $scope.receptionChannel = {};
            $scope.receptionChannels = {};
            $scope.structures = {
                receptionChannel: UtilsService.tableStructure($scope.labels.receptionChannels)
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.receptionChannel,
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
                base: '/canal-recepcao',
                create: '/criar',
                edit: '/editar'
            };

            if ($location.path() == route.base +  route.create) {
              $scope.page = 'create';
            }else if ($location.path() == route.base +  route.edit) {
              $scope.page = 'edit';
              console.log($scope.$parent.savedStates);
              $scope.receptionChannel = $scope.$parent.savedStates.receptionChannel;
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
                ReceptionChannelService.get(queryDefaults).$promise.then(function (response) {
                    $scope.receptionChannels = response.content;
                    $scope.structures.receptionChannel = UtilsService.tableStructure($scope.labels.receptionChannels, $scope.receptionChannels[0]);
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
                ReceptionChannelService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.receptionChannels = response.content;
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
                ReceptionChannelService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.receptionChannels = response.content;
                    pagination(response);
                });
            }

            function searchFilterRefBigModal(referenceField) {
                if (referenceField == 'receptionChannels') {
                    ReceptionChannelService.get().$promise.then(function (response) {
                        $scope.$parent.generic.modal.labels = $scope.labels.receptionChannels;
                        $scope.$parent.generic.modal.data = response.content;
                        $scope.$parent.generic.modal.selectEventName = 'eventSearchReceptionChannelsChosen';
                        $scope.$parent.generic.modal.checkedData = [];
                        $scope.$parent.generic.modal.show();
//                    console.log(response.content);
                    });
                }
            }

            $scope.create = function (context) {
                if (context == 'create')
                    ReceptionChannelService.save($scope.receptionChannel,
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
                    ReceptionChannelService.update({id: $scope.receptionChannel.id}, $scope.receptionChannel,
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
                receptionChannel = $scope.receptionChannels[i];
                console.log(receptionChannel);
                $scope.receptionChannel = receptionChannel;
                $scope.display = {receptionChannel: {}};
            }

            function edit(i) {
              receptionChannel = $scope.receptionChannels[i];
              console.log(receptionChannel);
              display = {receptionChannel: {}};

              promises = {};
              promises.selectedReceptionChannel = ReceptionChannelService.get({id: receptionChannel.id}).$promise;

              $q.all(promises).then(function (data) {
                  display.receptionChannel.canal = data.selectedReceptionChannel.toJSON().canal;
                  $scope.$parent.savedStates.receptionChannel = receptionChannel;
                  $scope.$parent.savedStates.display = display;

                  $location.path(route.base + route.edit);

                });
              }

            function remove(i) {
              $scope.$parent.generic.dialog.title = 'Remover Canal de Recepção';
              $scope.$parent.generic.dialog.message = 'Tem a certeza de que pretende remover este canal de recepção?';
              $scope.$parent.generic.dialog.btnFn.confirmation = function () {
                    id = $scope.receptionChannels[i].id;
                    ReceptionChannelService.delete({id: id}, function (resp, headers) {
                        $scope.$parent.successMsg();
                        $scope.receptionChannels.splice(i, 1);
                    }, function (err) {
                        $scope.$parent.failureMsg()();

                    });
                };
                $scope.$parent.generic.dialog.show();
            }

            $scope.receptionChannelModal = function () {
                ReceptionChannelService.get().$promise.then(function (response) {
                    $scope.$parent.generic.modal.labels = $scope.labels.receptionChannel;
                    $scope.$parent.generic.modal.data = response.content;
                    $scope.$parent.generic.modal.selectEventName = 'eventReceptionChannelChosen';
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
                        promises.push(ReceptionChannelService.delete({id: $scope.receptionChannels[k].id}).$promise);
                });

                if (promises.length != 0) {
                    $q.all(promises).then(function (data) {
                        $scope.$parent.successMsg();
                        angular.forEach($scope.bulkSelect.items, function (item, k) {
                            if (item)
                                $scope.receptionChannels.splice(k, 1);
                        });
                        resetList();
                    }, function (data) {
                        $scope.$parent.failureMsg();
                        resetBulkSelect();
                    });
                }

            }

        });
