angular.module("sgeApp").controller("HomeController",
        function ($scope, breadcrumbs, SessionService, APP, ValidateService, $translate, Auth) {
//            console.log($scope.$route);

            $scope.status = 'Online';
            $scope.profile = Auth.profile;
            $scope.isAdmin = Auth.authz.hasRealmRole('admin-sge');

            $scope.logout = function () {
                Auth.logout();
            }

            $scope.account = function () {
                Auth.account();
            }

            $scope.$on("$routeChangeSuccess", function (event, current, previous) {
                $scope.title = current.$$route.title;
            });

            $scope.app = APP;
            $scope.validationKey = null;
            $scope.breadcrumbs = breadcrumbs;

            $scope.savedStates = {};
            $scope.profileSelected = SessionService.getSelectedProfile();
            $scope.appContext = $scope.profileSelected[2];
            $scope.profiles = [
                'Administração',
                {sge: ['Coletivo', 'Individual']},
                {uni: ['Coletivo', 'Individual']},
            ];
            $scope.menus = {};
            $scope.menus['Administração'] = [
                {
                    'Configurações': [
                        {title: 'Globais', link: 'configuracoes-globais'},
                        {title: 'SMTP', link: 'configuracoes-smtp'},
                        {title: 'Mensagens', link: 'configuracoes-mensagens'}
                    ],
                    Tabelas: [
                        {title: 'Países', link: 'paises'},
                        {title: 'Províncias', link: 'provincias'},
                        {title: 'Municípios', link: 'municipios'},
                        {title: 'Comunas', link: 'comunas'},
//                        {title: 'Aldeias/Bairros', link: '#'},
//                        {title: 'Áreas', link: '#'},
//                        {title: 'Secções', link: '#'},
                        {title: 'CAE', link: 'actividade-economica'},
                        {title: 'Situação das Empresas', link: 'situacao-empresa'},
                        {title: 'Formas Jurídicas', link: 'formas-juridicas'},
                        {title: 'Actividades Comerciais', link: 'actividades-comerciais'},
                        {title: 'Contabilidade das Empresas', link: 'contabilidade'},
                        {title: 'Origens de Documento', link: 'origens-documento'},
                        {title: 'Canais de Recepção', link: 'canal-recepcao'},
                        {title: 'Sectores Institucionais', link: 'sectores'},
                        {title: 'Tipos de Funcionário', link: 'tipo-funcionarios'},
                        {title: 'Títulos Académicos', link: 'titulos-academicos'},
                        {title: 'Géneros', link: 'generos'}
                    ]
                }
            ];
            $scope.menus.sge = [
                {
                    Mensagens: [
                        {title: 'Recebidas', link: 'mensagens/recebidas'},
                        {title: 'Enviadas', link: 'mensagens/enviadas'}
                    ],
                    Entidades: [
                        {title: 'Todas', link: 'entidades-coletivas'},
                        {title: 'Aprovadas', link: 'entidades-coletivas/aprovadas'},
                        {title: 'Por Aprovar', link: 'entidades-coletivas/por-aprovar'},
                        {title: 'Por Renovar', link: 'entidades-coletivas/por-renovar'},
                        {title: 'Eliminadas', link: 'entidades-coletivas/eliminadas'}
                    ],
                    Indicadores: [
                        {title: 'Entidades Não Atualizadas', link: 'indicadores-nao-atualizadas'},
                        {title: 'Entidades Criadas e Eliminadas', link: 'indicadores-criadas-eliminadas'},
                        {title: 'Entidades Por Província', link: 'indicadores-por-provincia'},
                        {title: 'Homens e Mulheres Por Ano', link: 'indicadores-homens-mulheres-ano'}
                    ],
                    'Validar Entidade': 'validar-entidade'
                },
                {
                    Mensagens: [
                        {title: 'Recebidas', link: 'mensagens-recebidas'},
                        {title: 'Enviadas', link: 'mensagens-enviadas'}
                    ],
                    Entidades: [
                        {title: 'Todas', link: 'entidades-individuais'},
                        {title: 'Aprovadas', link: 'entidades-individuais'},
                        {title: 'Por aprovar', link: 'entidades-individuais'},
                        {title: 'Eliminadas', link: 'entidades-individuais/eliminadas'}

                    ],
                    Indicadores: [
                        {title: 'Entidades Não Atualizadas', link: 'indicadores-nao-atualizadas'},
                        {title: 'Entidades Criadas e Eliminadas', link: 'indicadores-criadas-eliminadas'},
                        {title: 'Entidades Por Província', link: 'indicadores-por-provincia'},
                        {title: 'Homens e Mulheres Por Ano', link: 'indicadores-homens-mulheres-ano'}
                    ],
                    'Validar Entidade': 'validar-entidade'

                }
            ];
            $scope.menus.uni = [
                {
                    Entidades: 'entidades-coletivas',
                    Indicadores: [
                        {title: 'Entidades Não Atualizadas', link: 'indicadores-nao-atualizadas'},
                        {title: 'Entidades Criadas e Eliminadas', link: 'indicadores-criadas-eliminadas'},
                        {title: 'Entidades Por Província', link: 'indicadores-por-provincia'},
                        {title: 'Homens e Mulheres Por Ano', link: 'indicadores-homens-mulheres-ano'}
                    ],
                },
                {
                    Entidades: 'entidades-individuais',
                    Indicadores: [
                        {title: 'Entidades Não Atualizadas', link: 'indicadores-nao-atualizadas'},
                        {title: 'Entidades Criadas e Eliminadas', link: 'indicadores-criadas-eliminadas'},
                        {title: 'Entidades Por Província', link: 'indicadores-por-provincia'},
                        {title: 'Homens e Mulheres Por Ano', link: 'indicadores-homens-mulheres-ano'}
                    ],

                }
            ];
            $scope.session = SessionService;
            $scope.generic = {};
            $scope.generic.utils = {
                equals: equals,
                isArray: isArray,
                isObject: isObject,
                date: date,
                range: range,
                session: {
                    saveLabels: $scope.session.saveLabels
                }
            };
            $scope.generic.modal = {
                data: null,
                labels: null,
                select: null,
                show: modalShow,
                close: modalClose,
                checkedData: null,
                resource: null,
                pagination: {page: modalPage},
                setPagination: modalSetPagination
            };
            $scope.generic.dialog = {
                title: null,
                message: null,
                btnFn: {
                    confirmation: null,
                    cancelation: null
                },
                show: dialogShow,
                close: dialogClose,
                data: null
            };

            function modalPage(num) {
                var query = {page: num, size: APP.config.pageSize};
                $scope.generic.modal.resource.get(query).$promise.then(function (response) {
                    $scope.generic.modal.data = response.content;
                    modalSetPagination(response);
                });
            }

            function modalSetPagination(response) {
                $scope.generic.modal.pagination.totalElements = response.totalElements;
                $scope.generic.modal.pagination.numberOfElements = response.numberOfElements;
                $scope.generic.modal.pagination.totalPages = response.totalPages;
                $scope.generic.modal.pagination.first = response.first;
                $scope.generic.modal.pagination.last = response.last;
                $scope.generic.modal.pagination.number = response.number;
            }

            $scope.setProfileSelected = function (i, pos = null, k = null) {
//                console.log(i);
//                console.log(pos);
                if ((!$scope.generic.utils.isArray($scope.profileSelected) && i != $scope.profileSelected)
                        || $scope.profileSelected[0] != i || $scope.profileSelected[1] != pos) {
                    $scope.profileSelected = [i, pos, k];
                    $scope.appContext = k;
                    SessionService.saveSelectedProfile([i, pos, k]);
                    hideMenu(i);
            }
            };

            $scope.changeLanguage = function (key) {
                $translate.use(key);
            };

            var imported = document.createElement('script');
            imported.src = 'vendor/custom.js';
            document.body.appendChild(imported);

            function hideMenu(i) {
                $('.menu-' + i).toggleClass('hide');
            }

            function modalShow() {
                $('.select-modal').modal('show');
            }
            function dialogShow() {
                $('#dialog').modal('show');
            }
            function dialogClose(onClose = null) {
                if (onClose == null)
                    $('#dialog').modal('hide');
                else
                    $('#dialog').one('hidden.bs.modal', function () {
                        onClose();
                        onClose = null;
                    });
            }
            function modalClose(onClose = null) {
                if (onClose == null)
                    $('.select-modal').modal('hide');
                else
                    $('.select-modal').one('hidden.bs.modal', function () {
                        onClose();
                        onClose = null;
                    });
            }

            function equals(obj1, obj2) {
                return angular.equals(obj1, obj2);
            }
            function isArray(v) {
                return angular.isArray(v);
            }
            function isObject(v) {
                return angular.isObject(v);
            }

            $scope.date = date;

            function date(str, format) {
                slashPos = format.indexOf('/');
                hyphenPos = format.indexOf('-');
                if (slashPos != -1) {
                    split = str.split('/');
                    format = format.split('/');
                } else if (hyphenPos != -1) {
                    split = str.split('-');
                    format = format.split('-');
                }
                year = null;
                day = null;
                month = null;
                angular.forEach(format, function (v, k) {
//            console.log(v);
                    if (v == 'yyyy')
                        year = split[k];
                    else if (v == 'mm')
                        month = Number(split[k]) - 1;
                    else if (v == 'dd')
                        day = split[k];
                });
//        console.log(year + '_' + month + '_' + day);
                date = new Date();
                date.setDate(day);
                date.setMonth(month);
                date.setFullYear(year);
//        console.log(date);
                return date;
            }

            function range(min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {
                    input.push(i);
                }
                return input;
            }
            ;

            // TODO: THIS IS A QUICK FIX
            $scope.$on('$locationChangeStart', function (event, next, current) {

                setTimeout(function () {

                    $('.datepicker').datepicker({
                        format: 'yyyy-mm-dd'
                    });

                }, 500);
            });

            $scope.successMsg = function (onClose = null) {
                $scope.generic.dialog.title = 'Sucesso';
                $scope.generic.dialog.message = 'Operação efetuada com sucesso.';
                $scope.generic.dialog.show();
                $scope.generic.dialog.btnFn.confirmation = null;
                $scope.generic.dialog.btnFn.cancelation = null;
                if (onClose != null)
                    $scope.generic.dialog.close(onClose);
            };
            $scope.failureMsg = function (onClose = null) {
                $scope.generic.dialog.title = 'Falha';
                $scope.generic.dialog.message = 'Não foi possível efetuar esta operação.';
                $scope.generic.dialog.show();
                $scope.generic.dialog.btnFn.confirmation = null;
                $scope.generic.dialog.btnFn.cancelation = null;
                if (onClose != null)
                    $scope.generic.dialog.close(onClose);
            };
            $scope.emptyFieldMsg = function (onClose = null) {
                $scope.generic.dialog.title = 'Formulário Inválido';
                $scope.generic.dialog.message = 'Existem campos por preencher ou que contêm dados inválidos!';
                $scope.generic.dialog.show();
                $scope.generic.dialog.btnFn.confirmation = null;
                $scope.generic.dialog.btnFn.cancelation = null;
                if (onClose != null)
                    $scope.generic.dialog.close(onClose);
            };

            $scope.validateEntity = function () {
//                console.log($scope.validationKey);
                ValidateService.get({key: $scope.validationKey},
                        function (resp, headers) {
                            //success callback
                            $scope.successMsg(function () {
//                                    console.log('ffffffffffff');
//                                    $location.path(route.base);
                            });
                        },
                        function (err) {
                            // error callback
                            $scope.failureMsg();
                        });
            };

        });
