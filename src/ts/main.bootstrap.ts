/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />

/// <reference path="./main.config.ts" />

interface Window {
    requirejs :Require;
}

window.requirejs.config(window.rjsconfig);

window.requirejs(['angular', 'ts/app/name',  'ts/app', 'ga'], function (angular :ng.IAngularStatic, appName :string) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [appName]);
    });
});
