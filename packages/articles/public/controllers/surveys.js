'use strict';

angular.module('mean').controller('SurveyCtrl', ['$scope','$http', function ($scope, $http) {
  $scope.survey = null;
  angular.extend($scope, {
  	raleigh: {
  		lat: 35.843768,
        lng: -78.6450559,
        zoom: 10
    }
  });
  $scope.getData = function (projectID) {
  	var conf = { params: {pid: projectID}};
  	$http.get('/survey', conf).success(function(res, status, headers, config){
  		console.log(status);
  		console.log(config);
  		console.log(res);
  		console.log(res.features[0].geometry.coordinates[1]);
  		$scope.survey = res;
  		// $scope.center = {lat: res.features[0].geometry.coordinates[1] , lng: res.features[0].geometry.coordinates[0], zoom: 12};
  		angular.extend($scope, {
            raleigh: {lat: res.features[0].geometry.coordinates[1] , lng: res.features[0].geometry.coordinates[0], zoom:20},
        	geojson: {
                	data: res,
                	pointToLayer: function (feature, latlng){
                		return L.circleMarker(latlng, {fillColor: '#470467', weight: .5});
                	}        
                }
        });
  	})
  	.error(function(err){
  		console.log(err.status);
  	});

  	
  }







}]);