angular.module("sgeApp").controller("LoginController", function ($scope, AuthenticationService, $location) {
    
//    console.log('loginCtl');

    $scope.credentials = {username:'asdf', password:'asdf'};
    $scope.login = function(credentials) {
        $scope.$parent.$parent.autenticado = AuthenticationService.login(credentials);
        if($scope.$parent.$parent.autenticado)
            $location.path('/');
    };
});

