'use strict';

var fs = require('fs'),
	Path = require('path');

var data = [];
var setData = function (value){
	data.push(value); 
}
var WalkDirs = function (dirPath){
	console.log(dirPath);
	fs.readdir(dirPath, function (error, entries){
		if (error){
			console.log(error);
		}
		for (var i in entries){
			var fullPath = Path.join(dirPath, entries[i]);
			(function(fullPath){
				fs.stat(fullPath, function(err, stats){
					if (stats && stats.isFile()){
						var name = fullPath.split('\\' || '/')
						var lable = name[name.length - 1].split('.')[0];
						setData({'name': lable, 'path': fullPath});
					} else if (stats && stats.isDirectory()) {
						WalkDirs(fullPath);
					}
				});
			})(fullPath);
		}
	});
	// return data;
}
var getData = function(){
	setTimeout(function(){
		console.log(data);
		return data; 
	}, 500);
}

WalkDirs('./packages/articles/server/routes/docs/asbuilts/The Retreat at Raleigh');
getData();