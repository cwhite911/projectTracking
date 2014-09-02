'use strict';
var mongoose = require('mongoose'),
    Survey = mongoose.model('Survey');
var fs = require('fs');
var csv = require('csv');
var transform = require('proj4geojson');

var projectID;

exports.setProjectId = function (pid){
	projectID = pid;
}

var FeatureCollection = {
  		'type': 'FeatureCollection',
  		features: []
	};

var setGeojson = function (indata){
	FeatureCollection = indata;
	// console.log(FeatureCollection);
};

exports.getGeojson = function(){
	// console.log(FeatureCollection);
	setTimeout(function(){
		return FeatureCollection;
	}, 1000);
};
//Converts geojson feature collection coordinates from SRID:2264 to SRID: 4326
var nad83toWGS84 = function(FeatureCollection){
	var sr = '+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs';
	var wgs84geojson = transform.to(FeatureCollection, sr);
	// setGeojson(wgs84geojson);
	var surveyPoints = new Survey({
	  		projectId: projectID,
	  		surveyPoints: wgs84geojson
		});
            surveyPoints.save(function (err) {
                if (err) {
                    return res.jsonp(500, {
                        error: 'Cannot save the survey'
                    });
                }
                // res.jsonp(surveyPoints);
            });
};

//Takes array of arrays and the temp object and converts them into geojson features, which are pushed to a geojson feature collection
var toGeojson = function(a, temp, fc){
	for (var i in a){
		var x = parseFloat(a[i][1]);
		var y = parseFloat(a[i][2]);
		var count = 0;
		for (var k in temp){
			temp[k] = a[i][count];
			count++;
		}
	fc.features.push({
		id: a[i][0],
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [x, y]
		},
		properties: temp
	});
	}
	nad83toWGS84(fc);
};

//Take csv array and breaks out headers from data, the data is turned into an object using the headers and keys and the data as values
var csvToOject = function (data){
	var temp = {};
	var headers = data[0];
	var dataNoHeaders = data.slice(1);
	for (var each in headers){
		temp[headers[each]] = null;	
	}
	toGeojson(dataNoHeaders, temp, FeatureCollection );
};

//Open csv file and parses it into an array
exports.getCSV = function (filename) {

	var fileReadStream = fs.createReadStream(filename);
	fileReadStream.on('data', function (chunk){
		var csvdata = chunk.toString();
		csv.parse(csvdata, function(err, data){
	 		csvToOject(data);
	 		// console.log(FeatureCollection.features[0].geometry);
	 	});
	});
};


// getCSV('Villages of Swift Creek PH4.csv');

// setTimeout(function(){getGeojson();}, 1000);

