/// <reference path="../../typings/requirejs/require.d.ts" />

interface Window {
    rjsconfig :RequireConfig;
}

window.rjsconfig = {
    'baseUrl' : '.',
    'paths' : {
        'angular' : [
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.min',
            'assets/bower/angular/angular-1.3.3.min',
            'bower_components/angular/angular.min'
        ],
        'jquery' : [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
            'assets/bower/jquery/jquery-2.1.1.min',
            'bower_components/jquery/dist/jquery.min'
        ],
        'ga' : [
            '//google-analytics.com/ga',
            'assets/vendor/ga/ga',
            'vendor/ga/ga'
        ],
        'css' : [
            'assets/css',
            'src/css'
        ],
        'img' : [
            'assets/img',
            'src/img'
        ],
        'ts' : [
            'assets/js',
            'src/ts'
        ]
    },
    'shim' : {
        'angular' : {
            'deps'    : ['jquery'],
            'exports' : 'angular'
        }
    }
};
