'use strict';

angular.module('mean').controller('SearchCtrl', ['$scope','$http', '$filter', function ($scope, $http, $filter) {
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
    
    //Controlls side panel tabs
    $scope.pageState = {
        	devPlan: true,
        	project: false,
        	detailedIntersection: false
    	};

    $scope.checkSeachState = function (data){
      	for (var each in $scope.pageState){
            if (each === data){
                $scope.pageState[each] = true;    
            }
            else{
                $scope.pageState[each] = false;
            }
        }  
    };
    
    Array.prototype.find = function (objectid){
        for (var i = 0; i < this.length; i++) {
        	if (this[i] === objectid){
                return true;
            }
            else {
                return false;
            }
    	}  
    };
    
    //GETS list of field names and records
    $scope.fields = [];
	$scope.records = [];
	var start = 0;
	function getData(count, layerID){
        var options = {
            f: 'json',
            outFields: '*',
            where: 'OBJECTID >' + count,
            orderByFields: 'OBJECTID ASC',
            returnGeometry: false
        };
		$http.get(rest.development + '/'+ layerID + '/query?', {params: options, cache: true})
			.success(function(data){
                if ($scope.fields.length === 0){
                	for (var field in data.fields){
                    	$scope.fields.push(data.fields[field]);
                	}
               	}
				for (var f in data.features){
					$scope.records.push(data.features[f].attributes);
				}
                var len = data.features.length - 1;
         
                var startID = data.features[0].attributes.OBJECTID;
                var endID = data.features[len].attributes.OBJECTID;
       			
				if (data.features.length === 1000 ){
					start = endID;
					getData(start, layerID);
				}
            
			});
		}
    
    //Watches for changes in data to load
        $scope.$watchCollection('data', function(current, past) {
            $scope.$watchCollection('pageState', function(now, then) {
            if ($scope.pageState.devPlan === true){
                for (var each in $scope.data){
            		if ($scope.data[each].name === 'RPUD.DEVELOPMENT_PLANS'){
                        $scope.fields = [];
						$scope.records = [];
                        start = 0;
                		getData(start, $scope.data[each].id);
        			}
             	}  
    		}
            
            if ($scope.pageState.project === true){
                for (var each in $scope.data){
            		if ($scope.data[each].name === 'Project Tracking'){
                        $scope.fields = [];
						$scope.records = [];
                        start = 0;
                		getData(start, $scope.data[each].id);
        			}
             	}  
    		}
            
           	if ($scope.pageState.detailedIntersection === true){
                for (var each in $scope.data){
            		if ($scope.data[each].name === 'RPUD.DetailedIntersections'){
                        $scope.fields = [];
						$scope.records = [];
                        start = 0;
                		getData(start, $scope.data[each].id);
        			}
             	}  
    		}
           });
        });
	
	console.log($scope.records);
	$scope.searchText = '';
	$scope.planType = 'All';
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
        return true;
	};
	$scope.nextPage = function(){
		$scope.pageNumber+= 1;
	};
	$scope.prevPage = function(){
		$scope.pageNumber-= 1;
	};
    
    
    


}]);



