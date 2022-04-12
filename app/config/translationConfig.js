angular.module("sgeApp").config(['$translateProvider', function ($translateProvider) {

        $translateProvider
                .useStaticFilesLoader({
                    prefix: 'app/translations/',
                    suffix: '.json'
                })
                .preferredLanguage('pt-pt');
//                .useMissingTranslationHandlerLog();
    }]);

