var scotchApp=angular.module("readingRainbow",["ngRoute"]);scotchApp.config(function(e){e.when("/",{templateUrl:"pages/home.html",controller:"mainController"})}),scotchApp.controller("homeController",function(e){e.message="Everyone come and see how good I look!",e.query,e.request=require("request"),e.Q=require("q"),e.fs=require("fs"),e.kickass=require("kickass-search"),e.stream=function(){e.kickass.search("ebooks","great gatsby").then(function(o){e.mostSeeders(o).then(function(o){console.log(JSON.stringify(o)),e.download(o.magnet.href)})})},e.download=function(o){var n=require("webtorrent"),r=new n,t;r.download(o,function(o){console.log("Torrent info hash:",o.infoHash),o.files.forEach(function(o){var n=o.createReadStream(),r=e.fs.createWriteStream(o.name);n.pipe(r),console.log(r),console.log("done")})})},e.mostSeeders=function(o){if(!o||0==o.length)return console.log("ERROR"),null;var n=e.Q.defer();return e.compareSeeds(o).then(function(e){n.resolve(e)}),n.promise},e.compareSeeds=function(o){for(var n=e.Q.defer(),r=o[0],t=1;t<o.length;t++)parseInt(r.seed)<parseInt(o[t].seed)&&(r=o[t]);return n.resolve(r),n.promise}}),scotchApp.controller("bookController",function(e){e.message="Everyone come and see how good I look!"}),scotchApp.controller("readController",function(e){e.message="Everyone come and see how good I look!",e.readEPub=function(o){var n=require("epub"),r=new n("test.epub","/imagewebroot/","/articlewebroot/");r.on("error",function(e){throw console.log("ERROR\n-----"),e}),r.on("end",function(){r.getChapter(r.spine.contents[0].id,function(o,n){return o?void console.log(o):(console.log("\nFIRST CHAPTER:\n"),e.text=n.substr(0,512)+"...",void console.log(n.substr(0,512)+"..."))})}),r.parse()}});