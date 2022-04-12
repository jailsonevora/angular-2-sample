angular.module("sgeApp").controller("IndexController", function ($scope, AuthenticationService, $location) {

    if (!AuthenticationService.estaAutenticado())
        $location.path('/login');
    else if ($location.path() == '/login')
        $location.path('/');


    $scope.autenticado = AuthenticationService.estaAutenticado();

});
