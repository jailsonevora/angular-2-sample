angular.module("sgeApp").factory("AuthenticationService", function () {

    var username = 'admin';
    var password = 'admin';
    var estaAutenticado = true;

    var _login = function (credentials) {
        if (username == credentials.username && password == credentials.password)
            estaAutenticado = true;
        return estaAutenticado;
    };

    var _estaAutenticado = function () {
        return estaAutenticado;
    };


    return {
        login: _login,
        estaAutenticado: _estaAutenticado
    };

});