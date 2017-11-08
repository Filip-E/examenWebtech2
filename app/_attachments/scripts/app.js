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
    .controller('homeCtrl', function ($scope, actorServ) {
    	
    	$('#searchButton').on('click',function(){
    		$scope.movies = '';
    		var actor = $('#actorText').val().toLowerCase();
    		
    		actorServ.getMovies(actor).then(function(data){
        		console.log('resolve from ctrl: ' + data.toString());
        		$scope.movies = data.filmography.actor;
        	},function(err){
        		console.log('ctrl promise error: ' + err);
        	});
    	});
    })
    .service('actorServ',function($http, $q){
    	this.getMovies = function(actor) {
    		var q = $q.defer();
    		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(actor);
    		console.log(url);
        	$http.get(url)
        		.then(function(data){
        			
        			q.resolve(data.data[0]);
        		},function(err){
        			q.reject(err);
        		});
        	return q.promise;
    	}
    });