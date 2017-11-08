'use strict'

angular.module('movieApp', ['ngRoute'])

.config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'assets/home.html',
                controller: 'homeCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    })
    .controller('homeCtrl', function ($scope) {
    	
    	$('#searchButton').on('click',function(){
    	});
    })
    .service('addressServ',function($http, $q){

    });