var scotchApp=angular.module("readingRainbow",["ngRoute"]);scotchApp.config(function(e){e.when("/",{templateUrl:"views/index.html",controller:"homeController"}).when("/read",{templateUrl:"views/read.html",controller:"readController"})}),scotchApp.filter("unsafe",function(e){return e.trustAsHtml}),scotchApp.controller("homeController",function(e,o,r){e.search=function(){r.post("http://reading-rainbow.herokuapp.com/api/search",{msg:e.query}).success(function(e,o,r,n){console.log(e)}).error(function(e,o,r,n){})},r.get("http://reading-rainbow.herokuapp.com/api/popular").success(function(o,r,n,t){e.popular=o}).error(function(e,o,r,n){}),e.message="Everyone come and see how good I look!",e.query,e.request=require("request"),e.Q=require("q"),e.fs=require("fs"),e.kickass=require("kickass-search"),e.stream=function(){e.kickass.search("ebooks","great gatsby").then(function(o){e.mostSeeders(o).then(function(o){console.log(JSON.stringify(o)),e.download(o.magnet.href)})})},e.download=function(){console.log(magnetUri);var o=require("webtorrent"),r=new o,n;r.download(magnetUri,function(o){console.log("Torrent info hash:",o.infoHash),o.files.forEach(function(o){if(console.log(o.name),o.name.indexOf("epub")>=0){var r=o.createReadStream(),n=e.fs.createWriteStream(o.name);r.pipe(n),console.log(n),console.log("done")}})})},e.mostSeeders=function(o){if(!o||0==o.length)return console.log("ERROR"),null;var r=e.Q.defer();return e.compareSeeds(o).then(function(e){r.resolve(e)}),r.promise},e.compareSeeds=function(o){for(var r=e.Q.defer(),n=o[0],t=1;t<o.length;t++)parseInt(n.seed)<parseInt(o[t].seed)&&(n=o[t]);return r.resolve(n),r.promise}}),scotchApp.controller("bookController",function(e,o,r){var n=o.absUrl();e.search=n.substring(n.search("search=")+7),console.log(e.search),r.post("http://reading-rainbow.herokuapp.com/api/search",{query:e.search}).success(function(o,r,n,t){e.book=o,console.log(o)}).error(function(e,o,r,n){}),e.query,e.request=require("request"),e.Q=require("q"),e.fs=require("fs"),e.kickass=require("kickass-search"),e.stream=function(){e.kickass.search("ebooks","great gatsby").then(function(o){e.mostSeeders(o).then(function(o){console.log(JSON.stringify(o)),e.download(o.magnet.href)})})},e.download=function(){var o=require("webtorrent"),r=new o,n;console.log(e.book.magnet_link),r.download(e.book.magnet_link,function(o){console.log("Torrent info hash:",o.infoHash),o.files.forEach(function(o){if(console.log(o.name),o.name.indexOf("epub")>=0){var r=o.createReadStream(),n=e.fs.createWriteStream(o.name);r.pipe(n),console.log(n),console.log("done"),$(".hello").append('<a href="read.html?name='+o.name+'"><button class="fuckme">Hi</button></a>'),$(".fuckme").click()}})})},e.mostSeeders=function(o){if(!o||0==o.length)return console.log("ERROR"),null;var r=e.Q.defer();return e.compareSeeds(o).then(function(e){r.resolve(e)}),r.promise},e.compareSeeds=function(o){for(var r=e.Q.defer(),n=o[0],t=1;t<o.length;t++)parseInt(n.seed)<parseInt(o[t].seed)&&(n=o[t]);return r.resolve(n),r.promise}}),scotchApp.controller("readController",function(e,o){var r=o.absUrl();e.bookName=r.substring(r.search("name=")+5),console.log("one"),e.page=0,outerScope=e,e.readEPub=function(o){var r=require("epub");console.log("two");var n=new r(decodeURI(e.bookName),"/imagewebroot/","/articlewebroot/");n.on("error",function(e){throw console.log("ERROR\n-----"),e}),n.on("end",function(){n.getChapter(n.spine.contents[e.page].id,function(e,o){return outerScope.text="aa",e?void console.log(e):(console.log("\nFIRST CHAPTER:\n"),outerScope.text=o,outerScope.$apply(),console.log(outerScope.text),void console.log(o.substr(0,512)+"..."))})}),n.parse()},e.readEPub()});