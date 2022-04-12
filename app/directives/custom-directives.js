/* 
 *@author César Correia
 *@version 1.0.0
 */

var md = angular.module('cnlc-directives', []);

md.directive('maritalStatus', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '=',
            title: '=title'
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o.value as o.option for o in array" required><option value="">Escolha um estado civil</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});

md.directive('selectSearch', function($parse) {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '=',
            title: '=title',
            search: '&',
            previous: '&',
            next: '&'
        },
        template: `
            <select ng-model="model" ng-options="o.value as o.option for o in array" title="title" required class="chosen-select">
                <optgroup label="Nome do propriétário"></optgroup>
            </select>
        `,
        replace: true,
        link: function(scope, element, attrs) {
            var first;
            $(element).chosen();
            if (!first) {

                $(".ctnt").append(`
	            		<div class="col-md-1 mprev" ><i class="glyph-icon icon-caret-left previous"></i> </div>
		    			<div class="col-md-1 mnext" ><i class="glyph-icon icon-caret-right next"></i> </div>
		        		<div class="col-md-1 msearch" ><i class="glyph-icon icon-search"></i> </div>
	        		`);

            }
            $(".chosen-single div").html('<i class="glyph-icon icon-caret-down"></i>');

            $(element).chosen('render');
            $(".msearch").on('click', function() {
                var val = $('.my-search-box').val();
                scope.$parent.searchTerm = val;
                scope.search();
            });

            $(".mprev").on('click', function() {
                var val = $('.my-search-box').val();
                scope.$parent.searchTerm = val;
                scope.previous();
            });

            $(".mnext").on('click', function() {
                var val = $('.my-search-box').val();
                scope.$parent.searchTerm = val;
                scope.next();
            });

            scope.$watch('array', function(newvalue, oldvalue) {

                if (!first) {
                    element.trigger("chosen:updated");
                    first = true;
                }

                if (newvalue !== oldvalue) {
                    element.trigger("chosen:updated");
                }
            });
        }
    };
});

md.directive('status', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '='
        },
        template: `
            <select class="custom-select" ng-model="model" ng-options="o as o.name for o in array">
                <option value="">Escolha um estado</option>
            </select>
        `,
        replace: true,
        link: function(scope, element, attrs) {
            element.chosen();
            $(".chosen-single div").html('<i class="glyph-icon icon-caret-down"></i>');
            $(".chosen-single div").css('fix-height');
            scope.$watch('array', function(newvalue, oldvalue) {
                if (newvalue !== oldvalue) {
                    element.trigger("chosen:updated");
                }
            });
        }
    };
});

md.directive('skm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: false,
        template: '<div></div>',
        link: function(scope, element, attrs) {

            var map = L.skobbler.map(attrs.id, scope.skm);
        }
    }
});

md.directive('graphic', function() {
    return {
        restrict: 'E',
        scope: {
            headerValue: '=',
            headerTitle: '=',
            badgeValue: '=',
            chartValue: '=',
            reference: '=',
            description: '=',
            title: '='
        },
        template: `
            <div class="dashboard-box dashboard-box-chart bg-white content-box">
	            <div class="content-wrapper">
	                <div class="header" ng-bind="headerValue">
	                    <span ng-bind="headerTitle"></b></span>
	                </div>
	                <div class="bs-label bg-orange" ng-bind="badgeValue"></div>
	                <div class="center-div chart-orange" ng-bind="chartValue"></div>
	                <div class="row list-grade">
	                    <div class="col-md-12" ng-bind="reference"></div>
	                </div>
	            </div>
	            <div class="button-pane">
	                <div class="size-md float-left">
	                    <a href="#" title="" ng-bind="description">
	                        
	                    </a>
	                </div>
	                <a href="#" class="btn btn-info float-right tooltip-button" data-placement="top" title="{{title}}">
	                    <i class="glyph-icon icon-dollar"></i>
	                </a>
	            </div>
	        </div>
        `,
        replace: true,
        link: function(scope, element, attrs) {

        }
    };
});

md.directive('phonePrefix', function($parse) {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: `
        	<select ng-model="model" ng-options="o.value as o.option for o in array" required class="chosen-select">
                <optgroup label="Países"></optgroup>
            </select>
        `,
        replace: true,
        link: function(scope, element, attrs) {
            var first;
            $(element).chosen();
            $(".ctnt").append('<div class="col-md-1 msearch" ><i class="glyph-icon icon-search"></i></div>');
            $(".chosen-single div").html('<i class="glyph-icon icon-caret-down"></i>');

            scope.$watch('array', function(newvalue, oldvalue) {
                if (!first) {
                    element.trigger("chosen:updated");
                    first = true;
                }
                if (newvalue !== oldvalue) {
                    element.trigger("chosen:updated");
                }
            });
        }
    };
});


md.directive('gender', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: `
            <select ng-model="model" ng-options="o.value as o.option for o in array" required class="form-control">
                <option value="">Escolha um Género</option>
            </select>
        `,
        replace: true,
        link: function(scope, element, attrs) {
            $(element).select();
            setTimeout(function() {
                $(element).select();
            });
        }
    };
});

md.directive('valueState', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o.value as o.option for o in array"><option value="">Tudo</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker()
                .on('change', function(e) {});
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});

md.directive('agentList', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o as o.name for o in array" required><option value="">Escolha um Agente</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});

md.directive('usertype', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o.value as o.option for o in array"><option value="">Escolha um tipo</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});

md.directive('entity', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o as o.name for o in array"><option value="">Escolha uma Instituição</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});



md.directive('fileType', function() {
    return {
        restrict: 'E',
        scope: {
            array: '=',
            model: '=',
            class: '=',
            msg: '@'
        },
        transclude: true,
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o.value as o.option for o in array"><option value=""> <span ng-transclude>{{msg}}</span></option></select>',
        replace: true,
        link: function(scope, element, attrs) {

            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });

        }
    };
});

md.directive('changeSelect', function() {
    return {
        restrict: 'A',
        require: "ngModel",
        controller: function($scope, $element) {
            $scope.change_group = '1';
            $($element).selectpicker('render');
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$viewChangeListeners.push(function(x) {
                setTimeout(function() {
                    $(element).selectpicker('render');
                });
            });
        }
    };
});

md.directive('date', function() {
    return {
        restrict: 'E',
        scope: {
            pholder: '=',
            model: '=',
            class: '='
        },
        template: '<input ng-model="model" type="text"  placeholder="{{pholder}}" class="form-control" />',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).datepicker({
                format: "yyyy-mm-dd",
                todayHighlight: true,
                autoclose: true
            });
        }
    };
});

md.directive('birthday', function() {
    return {
        restrict: 'E',
        scope: {
            pholder: '=',
            model: '=',
            class: '='
        },
        template: '<input ng-model="model" type="text"  placeholder="{{pholder}}"  required readonly class="form-control" />',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).datepicker({
                format: "yyyy-MM-dd",
                todayHighlight: true,
                autoclose: true,
                endDate: '0d',
            });
        }
    };
});

md.directive('driverDate', function() {
    return {
        restrict: 'E',
        scope: {
            pholder: '=',
            model: '=',
            class: '='
        },
        template: '<input ng-model="model" type="text"  placeholder="{{pholder}}"  required readonly class="form-control" />',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).datepicker({
                format: "yyyy-mm-dd",
                todayHighlight: true,
                autoclose: true,
                endDate: '-18y',
                startDate: '-79y'
            });
        }
    };
});

md.directive('noValue', function() {
    return {
        restrict: 'E',
        template: '<div class="alert alert-warning"><h1>{{vm.novalue.title}}</h1><p>{{vm.novalue.desc}}</p></div>',
        replace: true,
        link: function(scope, element, attrs) {
            setTimeout(function() {
                //                scope.load= true;
            });
        }
    };
});

md.directive('fileBrowser', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: false,
        template: '<input class="btn btn-xs btn-primary" type="file" name="upload-file" >',
        link: function($scope, $element, $attrs, $controller) {
            var button, fileField, proxy;
            fileField = $element.find('[type="file"]').on('change', function() {
                proxy.val(angular.element(this).val());
            });
            proxy = $element.find('[type="text"]').on('click', function() {
                fileField.trigger('click');
            });
            button = $element.find('[type="button"]').on('click', function() {
                fileField.trigger('click');
            });
        }
    };

});


md.directive('input', function() {
    return {
        restrict: 'A',
        scope: {
            array: '=',
            model: '=',
            class: '='
        },
        template: '<select class="form-control" data-live-search="true" ng-model="model" ng-options="o.value as o.option for o in array"><option value="">Escolha o tipo do ficheiro</option></select>',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).selectpicker();
            setTimeout(function() {
                $(element).selectpicker('render');
            });
        }
    };
});