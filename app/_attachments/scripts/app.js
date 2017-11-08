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
}).controller('homeCtrl', function ($scope, imdbServ, couchdbSrv) {

	$('#searchButton').on('click',function(){
		$scope.movies = '';
		var actor = $('#actorText').val().toLowerCase();

		/*imdbServ.getMovies(actor).then(function(data){
        		console.log('resolve from ctrl: ' + data.toString());
        		$scope.movies = data.filmography.actor;
        	},function(err){
        		console.log('ctrl promise error: ' + err);
        	});*/
		couchdbSrv.getMovies(actor).then(function(data){
			console.log('resolve from ctrl: ' + data.toString());
			$scope.movies = data.filmography.actor;
		},function(err){
			console.log('error thrown by couchdbSrv.getMovies(actor): ' + err);
			imdbServ.getMovies(actor).then(function(data){
				$scope.movies = data.filmography.actor;
				couchdbSrv.postMovies(data);
			}, function(err){
				console.log('error thrown by imdbServ.getMovies(actor): ' + err);
			});
		});
	});
}).service('imdbServ',function($http, $q){
	this.getMovies = function(actorName) {
		var q = $q.defer();
		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(actorName);
		console.log(url);
		$http.get(url)
		.then(function(data){
			q.resolve(data.data[0]);
		},function(err){
			q.reject(err);
		});
		return q.promise;
	}
}).service('couchdbSrv',function($http, $q){
	this.getMovies = function(actorName) {
		var q = $q.defer();
		var url = 'http://localhost:5984/students/' + actorName;
		console.log(url);
		$http.get(url)
		.then(function(data){
			q.resolve(data.data);
		},function(err){
			q.reject(err);
		});
		return q.promise;
	}
	this.postMovies = function(actor){
		var postData = {
				'actor' : actor.title,
				'movies' : actor.filmography.actor
		};
		$.ajax({
			type: 'PUT',
			url: '../../' + actor.title,
			data: JSON.stringify(postData),
			contentType: 'application/json',
			dataType: "json",
			success: function(data){
				console.log('POST SUCCESS :' + data.toString());
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				console.log('postMovies PUT error: ' + errorThrown);
			}
		});
	}
});