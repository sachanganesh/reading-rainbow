	// create the module and name it scotchApp
	var scotchApp = angular.module('readingRainbow', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('homeController', function($scope) {
		// create a message to display in our view
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
	  $scope.download = function (magnetUri) {
	    var WebTorrent = require('webtorrent');
	    var client = new WebTorrent();
	    var pdf;
	    client.download(magnetUri, function (torrent) {
	      console.log('Torrent info hash:', torrent.infoHash);
	      torrent.files.forEach(function (file) {
	        var source = file.createReadStream();
		    var destination = $scope.fs.createWriteStream(file.name);
		    source.pipe(destination);
		    console.log(destination);
		    console.log("done");
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

	scotchApp.controller('bookController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	scotchApp.controller('readController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
		$scope.readEPub = function (file) {
			var EPub = require('epub');
			var epub = new EPub(file,  '/imagewebroot/', '/articlewebroot/');
			epub.on("error", function(err){
				console.log('ERROR\n-----');
				throw err;
			});
			epub.on('end', function () {
		    // epub is now usable
		    console.log(epub.metadata.title);
		    epub.getChapter('1', function (err, text) {});
			});
			epub.parse();
		}
	});