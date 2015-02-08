	// create the module and name it scotchApp
	var scotchApp = angular.module('readingRainbow', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'views/index.html',
				controller  : 'homeController'
			})

			.when('/read', {
				templateUrl : 'views/read.html',
				controller  : 'readController'
			})
	});

	scotchApp.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

	// create the controller and inject Angular's $scope
	scotchApp.controller('homeController', function($scope, $location, $http) {
		// create a message to display in our view
		$scope.search = function () {
			$http.post('http://reading-rainbow.herokuapp.com/api/search', {msg:$scope.query}).
			  success(function(data, status, headers, config) {
			    console.log(data);
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
		$http.get('http://reading-rainbow.herokuapp.com/api/popular').
		  success(function(data, status, headers, config) {
		   	$scope.popular = data;
		   	//console.log(data);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	  $scope.message = 'Everyone come and see how good I look!';
	  $scope.query;
	  $scope.request = require('request');
	  $scope.Q = require('q');
	  $scope.fs = require('fs');
	  $scope.kickass = require('kickass-search');
	  $scope.stream = function () {
	    $scope.kickass.search('ebooks', 'great gatsby').then(function (data) {
	      $scope.mostSeeders(data).then(function (torrent) {
	      	console.log(JSON.stringify(torrent));
	      	$scope.download(torrent.magnet.href);
	      });
	    });
	  }
	  $scope.download = function () {
	  	console.log(magnetUri);
	    var WebTorrent = require('webtorrent');
	    var client = new WebTorrent();
	    var pdf;
	    client.download(magnetUri, function (torrent) {
	      console.log('Torrent info hash:', torrent.infoHash);
	      torrent.files.forEach(function (file) {
	      	console.log(file.name);
	      	if (file.name.indexOf("epub") >= 0) {
		        var source = file.createReadStream();
			    var destination = $scope.fs.createWriteStream(file.name);
			    source.pipe(destination);
			    console.log(destination);
			    console.log("done");
			    //$location.url('read.html');
	      	}
	      });
	    });
	  }
	  $scope.mostSeeders = function (torrents) {
	    if (!torrents || torrents.length == 0) {
	      console.log('ERROR');
	      return null;
	    }
	    var deferred = $scope.Q.defer();
	    $scope.compareSeeds(torrents).then(function (data) {
	      deferred.resolve(data);
	    });
	    return deferred.promise;
	  }
	  $scope.compareSeeds = function (torrents) {
	    var deferred = $scope.Q.defer();
	    var torrent = torrents[0];
	    for (var i = 1; i < torrents.length; i++)
	      if (parseInt(torrent.seed) < parseInt(torrents[i].seed))
	        torrent = torrents[i];
	    deferred.resolve(torrent);
	    return deferred.promise;
	  }
	});

	scotchApp.controller('bookController', function($scope, $location, $http) {
		// create a message to display in our view
		var absUrl = $location.absUrl();
		$scope.search = absUrl.substring(absUrl.search('search=') + 7);
		console.log($scope.search);
		$http.post('http://reading-rainbow.herokuapp.com/api/search', {query:$scope.search}).
			  success(function(data, status, headers, config) {
			  	$scope.book = data;
			    console.log(data);
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
		});
			  $scope.query;
	  $scope.request = require('request');
	  $scope.Q = require('q');
	  $scope.fs = require('fs');
	  $scope.kickass = require('kickass-search');
	  $scope.stream = function () {
	    $scope.kickass.search('ebooks', 'great gatsby').then(function (data) {
	      $scope.mostSeeders(data).then(function (torrent) {
	      	console.log(JSON.stringify(torrent));
	      	$scope.download(torrent.magnet.href);
	      });
	    });
	  }
	  $scope.download = function () {
	    var WebTorrent = require('webtorrent');
	    var client = new WebTorrent();
	    var pdf;
	    console.log($scope.book.magnet_link);
	    client.download($scope.book.magnet_link, function (torrent) {
	      console.log('Torrent info hash:', torrent.infoHash);
	      torrent.files.forEach(function (file) {
	      	console.log(file.name);
	      	if (file.name.indexOf("epub") >= 0) {
		        var source = file.createReadStream();
			    var destination = $scope.fs.createWriteStream(file.name);
			    source.pipe(destination);
			    console.log(destination);
			    console.log("done");
			    //$location.path('read.html?name=' + file.name);
			    $(".hello").append('<a href="read.html?name=' + file.name + '"><button class="fuckme">Hi</button></a>');
			    $( ".fuckme" ).click();
			    //$location.path('read.html?name=' + file.name);
			    //$location.replace();
	      	}
	      });
	    });
	  }
	  $scope.mostSeeders = function (torrents) {
	    if (!torrents || torrents.length == 0) {
	      console.log('ERROR');
	      return null;
	    }
	    var deferred = $scope.Q.defer();
	    $scope.compareSeeds(torrents).then(function (data) {
	      deferred.resolve(data);
	    });
	    return deferred.promise;
	  }
	  $scope.compareSeeds = function (torrents) {
	    var deferred = $scope.Q.defer();
	    var torrent = torrents[0];
	    for (var i = 1; i < torrents.length; i++)
	      if (parseInt(torrent.seed) < parseInt(torrents[i].seed))
	        torrent = torrents[i];
	    deferred.resolve(torrent);
	    return deferred.promise;
	  }
	});

	scotchApp.controller('readController', function($scope, $location) {
		// create a message to display in our view
		var absUrl = $location.absUrl();
		$scope.bookName = absUrl.substring(absUrl.search('name=') + 5);
		console.log("one");
		//var temp = absUrl.substring(absUrl.search('name=') + 5);
		//temp = decodeURI(temp)
		//console.log(temp);
		//$scope.bookName = temp;
		//console.log($scope.bookName);
		$scope.page = 0;
		outerScope = $scope
		$scope.readEPub = function (file) {
			var EPub = require('epub');
			console.log("two");
			var epub = new EPub(decodeURI($scope.bookName),  '/imagewebroot/', '/articlewebroot/');
			epub.on("error", function(err){
				console.log('ERROR\n-----');
				throw err;
			});

			epub.on('end', function () {
			    	epub.getChapter(epub.spine.contents[$scope.page].id, function(err, data){
					outerScope.text = "aa"
			        if(err){
			            console.log(err);
			            return;
			        }
			        console.log("\nFIRST CHAPTER:\n");
			        outerScope.text = data;
			        outerScope.$apply()
			        console.log(outerScope.text);
			        console.log(data.substr(0,512)+"..."); // first 512 byte
			    });
		    });
			epub.parse();
		}

		$scope.readEPub();
	});