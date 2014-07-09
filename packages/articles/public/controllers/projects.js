'use strict';

angular.module('mean').controller('ProjectCtrl', ['$scope','$http', '$stateParams', function ($scope, $http, $stateParams) {
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
    $scope.fullRecord = [];
	$scope.whichItem = $stateParams.itemId;
	var start = 0;
	function getData(count, layerID){
		var options = {
            f: 'json',
            outFields: '*',
            where: 'OBJECTID >' + count,
            orderByFields: 'OBJECTID ASC',
            returnGeometry: true
        };
		$http.get(rest.development + '/'+ layerID + '/query?', {params: options, cache: true})
			.success(function(results){
			for (var each in results.features){
				$scope.records.push(results.features[each].attributes);   
			}
            $scope.fullRecord.push(results)
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

	$scope.getFiles = function (plan){
		$scope.req = 'http://gis.raleighnc.gov/publicutility/devplans/' + plan;
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

}]);


angular.module('mean').controller('SimpleMapController', [ '$scope', function($scope) {
   angular.extend($scope, {
                center: {
                    lat: 35.843768,
                    lng: -78.6450559,
                    zoom: 11
                },
       defaults: {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        maxZoom: 14,
        path: {
            weight: 10,
            color: '#800000',
            opacity: 1
        }
    },
       layers: {
                    baselayers: {
				    	world: {
					    	name: 'Imagery',
					        type: 'dynamic',
					        url: 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer',
					        visible: false,	        
					        layerOptions: {
					            layers: [0, 1, 2, 3],
				                opacity: 1,
				                attribution: 'Copyright:© City of Raleigh'
					        }
				    	},
                    }
//                         projects:{
//                    			name: 'Project Tracking',
//                    			type: 'Feature Layer',
//                    			url: 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer/'
//                    			visible: true,
//                    			layerOptions: {
//                    				layers: [1],
//                    				opacity: 1,
//                   		 		attribution: 'Copyright:© City of Raleigh'
//                	   			}
//                			}
//                     },
   }
     
        });
}]);