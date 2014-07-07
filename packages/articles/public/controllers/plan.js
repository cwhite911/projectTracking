'use strict';

angular.module('mean').controller('PlanCtrl', ['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.records = [];
	$scope.whichItem = $routeParams.itemId;
	var start = 0;
	function getData(count){
		var options = {outFields: '*', where: 'OBJECTID >' + count};
		$http.get('http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2/query?f=pjson', {params: options})
			.success(function(data){
			for (var each in data.features){
				$scope.records.push(data.features[each].attributes);
			}
			if (data.features.length === 1000 ){
				start = start + 1000;
				getData(start);
			}
			if ($routeParams.itemId > 0) {
				$scope.prevItem = Number($routeParams.itemId)-1;
			} else {
				$scope.prevItem = $scope.records.length-1;
			}
			if ($routeParams.itemId < $scope.records.length-1) {
				$scope.nextItem = Number($routeParams.itemId)+1;
			} else {
				$scope.nextItem = 0;
			}
		});
	}
	getData(start);
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
                }
            });
}]);