'use strict';

angular.module('mean').controller('SearchCtrl', ['$scope','$http', '$filter', function ($scope, $http, $filter) {
	$scope.fields = [];
	$scope.searchText = '';
	$http.get('http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2?f=pjson').success(function(data){
		$scope.fields = data;
		console.log(data);
	});
	$scope.planType = 'All';
	$scope.records = [];
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
		});
	}
	getData(start);
	console.log($scope.records);
	
	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		$scope.records = orderBy($scope.records, predicate, reverse);
	};
	$scope.order('-OBJECTID',false);
	$scope.filteredText = '';
	$scope.pageSize = 10;
	$scope.numberPages = 1;
	$scope.pageArray = [];
	$scope.pageInfo = [];
	$scope.pageNumber = 0;

	$scope.getRecordLength = function (info, plantype){
		$scope.pageArray = [];
		$scope.pageInfo = [];
		// if ($scope.pageNumber > 0){
			// $scope.pageNumber = 0;
		// }
		var slicer = {start:0, end: 10};
		if (plantype !== 'All'){
			$scope.filteredText = $filter('filter')($scope.records, {$: info, PLAN_TYPE: plantype});
		}
		else{
			$scope.filteredText = $filter('filter')($scope.records, info);
		}
		$scope.numberPages = Math.ceil($scope.filteredText.length/$scope.pageSize);
		for (var i = 0; i < $scope.numberPages; i++){
			$scope.pageArray.push(i);
			$scope.pageInfo.push($scope.filteredText.slice(slicer.start, slicer.end));
			slicer.end += 10;
			if (slicer.start === 0){
				slicer.start += 11;
			}
			else{
				slicer.start += 10;
			}
		}
	};

	$scope.checkPage = function (page){
		$scope.pageNumber = page;
	};
	$scope.nextPage = function(){
		$scope.pageNumber+= 1;
	};
	$scope.prevPage = function(){
		$scope.pageNumber-= 1;
	};


}]);

