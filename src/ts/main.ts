/// <reference path="../../typings/requirejs/require.d.ts" />
requirejs.config({
    'baseUrl' : '.',
    'deps' : [
        'assets/js/bootstrap',
        'ga'
    ],
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
        ]
    },
    'shim' : {
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'ga' : {
            'init' : function () {
                var _gaq :any[] = [];
                _gaq.push(['_setAccount', 'UA-17120667-1']);
                _gaq.push(['_trackPageview']);
            }
        }
    }
});
