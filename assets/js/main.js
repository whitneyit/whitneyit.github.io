(function () { 'use strict';

requirejs.config({
    'baseUrl' : '.',
    'paths' : {
        'angular' : [
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.min',
            'assets/lib/angular/angular-1.3.3.min'
        ],
        'jquery' : [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
            'assets/lib/jquery/jquery-2.1.1.min'
        ],
        'ga' : [
            '//google-analytics.com/ga',
            'assets/vendor/ga/ga'
        ],
        'css' : 'assets/css',
        'img' : 'assets/img',
        'js'  : 'assets/js'
    },
    'shim' : {
        'angular' : {
            'deps'    : ['jquery'],
            'exports' : 'angular'
        }
    }
});

requirejs(['angular', 'js/app/name',  'js/app', 'ga'], function (angular, appName) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [appName]);
    });
});

})();
