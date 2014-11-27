requirejs.config(window.rjsconfig);

requirejs(['angular', 'js/app/name',  'js/app', 'ga'], function (angular, appName) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [appName]);
    });
});
