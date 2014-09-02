'use strict';

angular.module('mean').controller('ProjectCtrl', ['$scope','$http', '$stateParams', '$location', function ($scope, $http, $stateParams, $location) {
    //REST API services
    var rest = {
        development: 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer',
        production: 'http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer'
    };
    //Gets array of objects of layer ids and names
	$scope.data = [];
    $http.get(rest.development, {params: {f: 'json'}, cache: true}).success(function(data){
		var layers = data.layers;
        var tables = data.tables;
		for (var l in layers){
            $scope.data.push(layers[l]);
        }
        for (var t in tables){
            $scope.data.push(tables[t]);
        }
	});
	$scope.records = [];
    
	$scope.whichItem = $stateParams.itemId;
	var start = 0;
	function getData(count, layerID){
		var options = {
            f: 'json',
            outFields: '*',
            where: 'OBJECTID >' + count,
            orderByFields: 'OBJECTID ASC',
            outSR: 4326,
            returnGeometry: true
        };
		$http.get(rest.development + '/'+ layerID + '/query?', {params: options, cache: true})
			.success(function(results){
			for (var each in results.features){
				$scope.records.push(results.features[each]);  
			}
            
			var len = results.features.length - 1;
            var endID = results.features[len].attributes.OBJECTID;
			if (results.features.length === 1000 ){
				start = endID;
				getData(start, layerID);
			}
			if ($stateParams.itemId > 0) {
				$scope.prevItem = Number($stateParams.itemId)-1;
			} else {
				$scope.prevItem = $scope.records.length-1;
			}
			if ($stateParams.itemId < $scope.records.length-1) {
				$scope.nextItem = Number($stateParams.itemId)+1;
			} else {
				$scope.nextItem = 0;
			}
		});
	}
    $scope.$watchCollection('data', function(current, past) {
    	for (var i in $scope.data){
        	if ($scope.data[i].name === 'Project Tracking'){
            	getData(start, $scope.data[i].id);
        	}
    	}
    });  
	
	console.log($scope.records);


    
    
    
//Set up to project data back to ArcGIS Server
//         $scope.geoOptions = {
//             f: 'json',
//             inSR: 2264,
//       		outSR: 4326,
//         	geometries: {
//                 'geometryType': 'esriGeometryPolygon',
//                 'geometries': []
//             }
//         };
    
// 	$scope.setGeometry = function (data){
//         if (data !== undefined){
//         	$scope.geoOptions.geometries.geometries.push(data);
//         }
//     }
//     $scope.$watchCollection('records', function(current, past) {

//     $http.get('http://gis.raleighnc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer/project', {params: $scope.geoOptions, cache: true}).success(function(webgeo){
//         console.log(webgeo);
//     });
    
// });

	$scope.getFiles = function (plan){
		$scope.req = 'http://localhost:8000/corpubw/' + plan;
		$http.get($scope.req)
			.success(function(data){
				console.log(data);
				$scope.devPlans = data;
				$scope.el = $( '<div></div>' );
				$scope.el.html($scope.devPlans);
				$scope.parsedHTML = $('pre', $scope.el);
				$scope.parsedHTML = $scope.parsedHTML[0].outerHTML;
				console.log($scope.parsedHTML[0]);
			})
			.error(function(err){
				if (err) {
					console.log(err);
					$scope.parsedHTML = '<h3>No files avaliable at this time.</h3>';
				}
			});
	};

    // $scope.getFiles = function (plan){
    //     $.ajax({
    //         url: 'http://taskrunner/corpubw/' + plan,
    //         type: 'GET',
    //         // crossDomain: true,
    //         // xhrFields: {
    //         //     withCredentials: true
    //         // },
    //         dataType: 'jsonp',
    //         mimeType: 'text/javascript', 
    //         success: function (data){
    //             console.log(data);
    //         }


    //     })
    // }


    
//Check permits

    $scope.checkPermit = function(type){
        if (type === 1){
            return true;
        }
        else{
            return false;
        }
        
    }
    
    
 //Creates geojson object and creates map bounds object.  
    $scope.getGeojson = function (geo, attr){
        $scope.geojson = {
            "type": "FeatureCollection",
    		"features": [
        //     { "type": "Feature",
        // "geometry": {"type": "Point", "coordinates": [35.843768, -78.6450559]},
        // "properties": {"prop0": "value0"}
        // },
      			{ 
                    "type": "Feature",
         			"geometry": {
           				"type": "Polygon",
           				"coordinates": geo
         			},
         			"properties": attr
         		}
       		]
     	};
        $scope.bounds = 
            {
            	lat: geo[0][0][1],
                lng: geo[0][0][0],
            	zoom: 16
             };
        
        angular.extend($scope, {
             center: $scope.bounds,
        	geojson: {
                	data: $scope.geojson,
                 	style:{
                    	fillColor: '#470467',
                    	weight: 2,
                    	opacity: 1,
                    	color: '#470014',
                    	fillOpacity: 0.7
                	},               
                }
        });
};
    

$scope.projectNames = [];
    $scope.predicate = 'PROJECTNAME';
    
//Watach records for changes and set geojson data 
  $scope.$watchCollection('records', function(curretn, past){
    for (var p in $scope.records){
            $scope.projectNames.push($scope.records[p].attributes);
        }
        for (var s in $scope.projectNames){
            $scope.projectNames[s].SPROJECTID = $scope.projectNames[s].PROJECTID.toString();
        }
        $scope.title = $scope.projectNames[1];
      if ($scope.records[$scope.whichItem] !== undefined){
    	$scope.geo = $scope.records[$scope.whichItem].geometry.rings;
    	$scope.attr = $scope.records[$scope.whichItem].attributes;
    	$scope.getGeojson($scope.geo, $scope.attr);
    }
      
  });
  
  
//Default set up for map, adds default center, legend, google map layers    
   angular.extend($scope, {
                center: {
                    lat: 35.843768,
                    lng: -78.6450559,
                    zoom: 10
                },
       			legend: {
                    colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
                    labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
                },
       			layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
	                        name: 'Google Hybrid',
	                        layerType: 'HYBRID',
	                        type: 'google'
	                    },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
       			

     
        });

}]);
