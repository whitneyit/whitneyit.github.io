/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <amd-dependency path="ga"/>

import angular = require('angular');
import appDeps = require('./app/deps');
import appName = require('./app/name');

var app = angular.module(appName, appDeps);
export = app;
