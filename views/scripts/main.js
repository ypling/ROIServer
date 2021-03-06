/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize','CompareChart'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/planforward', {
                templateUrl: './views/planforward.html',
                controller: 'forwardCtrl'
            })
            .when('/lookback', {
                templateUrl: './views/lookback.html',
                controller: 'backCtrl'
            })
            .when('/myscenarios', {
                templateUrl: './views/myscenarios/list.html',
                controller: 'scenariosCtrl'
            })
            .when('/myscenarios/compare', {
                templateUrl: './views/myscenarios/compare.html',
                controller: 'scenariosCompareCtrl'
            })
            .when('/myscenarios/export', {
                templateUrl: './views/myscenarios/export.html',
                controller: 'scenariosExportCtrl'
            })
            .when('/myscenarios/share', {
                templateUrl: './views/myscenarios/share.html',
                controller: 'scenariosShareCtrl'
            })
            .when('/lookback/save', {
                templateUrl: './views/lookback/save.html',
                controller: 'saveCtrl'
            })
            .when('/planforward/save', {
                templateUrl: './views/planforward/save.html',
                controller: 'saveCtrl'
            })
            .otherwise({
                templateUrl: './views/dashboard.html',
                controller: ''
            })
    });
app.controller("indexCtrl", function ($scope) {
    $scope.users = {};
    $scope.users.name = "Ed";
    $scope.users.recentlyLoginDate = new Date();
});