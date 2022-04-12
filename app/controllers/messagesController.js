angular.module("sgeApp").controller("MessagesController",
        function ($scope, UtilsService, $route, MsgService, searchFilters) {

            var APP = $scope.$parent.app;

            $scope.labels = $scope.$parent.session.getLabels();
            $scope.messages = {};
            $scope.structures = {
                message: {}
            };

            $scope.singleSearch = {
                value: null,
                submit: singleSearchSubmit
            };
            $scope.searchFilters = {
                scheme: searchFilters.entity,
                values: {
                },
                fn: {
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
            $scope.buttons = {};

            if ($route.current.name == 'received') {

                $scope.actions = {
                    view: view
                };

                MsgService.get().$promise.then(function (response) {
                    $scope.messages = response.content;
                    $scope.structures.message = UtilsService.tableStructure($scope.labels.messages, $scope.messages[0]);
                    pagination(response);
                });
            } else if ($route.current.name == 'sent') {

            } else if ($route.current.name == 'all') {

            }

            function view(i) {
                $('#detail-modal').modal('show');
                message = $scope.messages[i];
                $scope.message = message;
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
                MsgService.search({keyword: $scope.singleSearch.value}).$promise.then(function (response) {
                    $scope.messages = response.content;
                    pagination(response);
                });
            }

            function page(num) {
                $scope.searchFilters.query.page = num;
                searchFilterSubmit(false);
            }

            function sort(col, asc) {
                if (asc) {
                    $scope.searchFilters.query.sort = col + ',asc';

                } else {
                    $scope.searchFilters.query.sort = col + ',desc';

                }
                $scope.searchFilters.query.page = queryDefaults.page;
                searchFilterSubmit(false);
            }

            function searchFilterSubmit(requery = true) {
                if (requery) {
                    $scope.searchFilters.query = UtilsService.getQueryObj($scope.searchFilters.values);
                    $scope.searchFilters.query.size = queryDefaults.size;
                }
                MsgService.get($scope.searchFilters.query).$promise.then(function (response) {
                    $scope.messages = response.content;
                    pagination(response);
                });
            }

        });
