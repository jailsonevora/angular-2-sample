'use strict';

var auth = {
    logout: function () {
    },
    account: function () {
    }
};

var app = angular.module("sgeApp", [
    'ngMessages',
    'ngRoute',
    'ng-breadcrumbs',
    'ui',
    'ngResource',
    'ngMap',
    'pascalprecht.translate'
]);

// on every request, authenticate user first
angular.element(document).ready(function ($http) {
    var kc = new Keycloak('ks/keycloak.json');
    auth.loggedIn = false;

    kc.onAuthSuccess = function () {
        console.log('Auth Success');
    };
    kc.onAuthError = function (errorData) {
        console.log('Auth Error: ' + JSON.stringify(errorData));
    };
    kc.onAuthRefreshSuccess = function () {
        console.log('Auth Refresh Success');
    };
    kc.onAuthRefreshError = function () {
        console.log('Auth Refresh Error');
    };

    kc.onAuthLogout = function () {
        console.log('Auth Logout');
    };

    kc.onTokenExpired = function () {
        console.log('Access token expired.');
    };

    kc.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        enableBearerInterceptor: true,
        bearerExcludedUrls: [
            '/assets'
        ],
    }).success(function () {
            auth.loggedIn = true;
            auth.authz = kc;
            auth.logout = function () {
                auth.loggedIn = false;
                auth.authz = null;
                auth.profile = {};
                kc.logout();
            }

            auth.claims = {};
            auth.claims.name = kc.idTokenParsed.name;

            auth.authc = {};
            auth.authc.token = kc.token;

            auth.account = function () {
                kc.accountManagement();
            }

            auth.hasRole = function (name) {
                if (kc && kc.hasRealmRole(name)) {
                    return true;
                }
                return false;
            };

            auth.isAdmin = function () {
                return auth.hasRole("admin-sge");
            };

            auth.authorization = new KeycloakAuthorization(kc);

            console.log(JSON.stringify(kc.tokenParsed));

            app.factory('Auth', function () {
                return auth;
            });

            kc.loadUserProfile().success(function (profile) {
                auth.profile = profile;
                angular.bootstrap(document, ['sgeApp'], {
                });
            });

        }).error(function () {

        });
});

app.factory('authInterceptor', ['$q', 'Auth', '$injector', '$timeout', function ($q, Auth, $injector, $timeout) {
    return {
        request: function (request) {
            if (Auth.authorization && Auth.authorization.rpt && request.url.indexOf('/authorize') == -1) {
                var retries = 0;
                request.headers.Authorization = 'Bearer ' + Auth.authorization.rpt;
            } else {
                request.headers.Authorization = 'Bearer ' + Auth.authc.token;
            }
            return request;
        },
        responseError: function (rejection) {
            var status = rejection.status;

            if (status == 403 || status == 401) {
                var retry = (!rejection.config.retry || rejection.config.retry < 1);

                if (!retry) {
                    //document.getElementById("output").innerHTML = 'You can not access or perform the requested operation on this resource.';
                    return $q.reject(rejection);
                }

                if (rejection.config.url.indexOf('/authorize') == -1 && retry) {
                    // here is the authorization logic, which tries to obtain an authorization token from the server in case the resource server
                    // returns a 403 or 401.
                    var wwwAuthenticateHeader = rejection.headers('WWW-Authenticate');

                    // when using UMA, a WWW-Authenticate header should be returned by the resource server
                    if (!wwwAuthenticateHeader) {
                        return $q.reject(rejection);
                    }

                    // when using UMA, a WWW-Authenticate header should contain UMA data
                    if (wwwAuthenticateHeader.indexOf('UMA') == -1) {
                        return $q.reject(rejection);
                    }

                    var deferred = $q.defer();

                    var params = wwwAuthenticateHeader.split(',');
                    var ticket;

                    // try to extract the permission ticket from the WWW-Authenticate header
                    for (i = 0; i < params.length; i++) {
                        var param = params[i].split('=');

                        if (param[0] == 'ticket') {
                            ticket = param[1].substring(1, param[1].length - 1).trim();
                            break;
                        }
                    }

                    // a permission ticket must exist in order to send an authorization request
                    if (!ticket) {
                        return $q.reject(rejection);
                    }

                    // prepare a authorization request with the permission ticket
                    var authorizationRequest = {};
                    authorizationRequest.ticket = ticket;

                    // send the authorization request, if successful retry the request
                    Auth.authorization.authorize(authorizationRequest).then(function (rpt) {
                        deferred.resolve(rejection);
                    }, function () {
                        //document.getElementById("output").innerHTML = 'You can not access or perform the requested operation on this resource.';
                    }, function () {
                        //document.getElementById("output").innerHTML = 'Unexpected error from server.';
                    });

                    var promise = deferred.promise;

                    return promise.then(function (res) {
                        if (!res.config.retry) {
                            res.config.retry = 1;
                        } else {
                            res.config.retry++;
                        }

                        var $http = $injector.get("$http");

                        return $http(res.config).then(function (response) {
                            return response;
                        });
                    });
                }
            }

            return $q.reject(rejection);
        }
    };
}]);

app.config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');

}]);