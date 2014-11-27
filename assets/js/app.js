define(["require", "exports", 'angular', './app/deps', './app/name', "ga"], function (require, exports, angular, appDeps, appName) {
    var app = angular.module(appName, appDeps);
    return app;
});
