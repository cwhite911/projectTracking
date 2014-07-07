'use strict';

//angular.module('angularCodeSchoolApp')
angular.module('mean').controller('FormCtrl', function ($scope) {
  $scope.editor = 'Name';
});

angular.module('mean').directive('myForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'articles/views/my-form.html',
		controller: function ($http, $scope){
			$scope.fields = [];
      $scope.postResults = {};
      $scope.deleteResults = {};
			$http.get('http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2?f=pjson')
        .success(function(data){
          $scope.fields = data;
        }),
      $scope.checkForType = function (value, id){
        if ($scope.fields.fields[id].type === value){
          return true;
        }
      },
      $scope.checkID =function (value){
        if ('OBJECTID' !== value){
          return true;
        }
      },
      $scope.send = function (data){
        var update = [{attributes: data}];
        var info = angular.toJson(update);
        $http.post('http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2/addFeatures', data, {params: { f: 'json', features: info} })
        .success(function(res){
          console.log(res);
          for (var i in $scope.fields.fields){
            if (i > 0){
              var fieldName = $scope.fields.fields[i].name;
              $scope.updateForm[fieldName] = '';
            }
          }
          $scope.updateForm.$setPristine();
          $scope.postResults = res.addResults[0];
          $scope.deleteResults = false;
          console.log($scope.postResults);
        })
        .error(function(err){
          if(err){
            console.log(err);
          }
        });
      },
      $scope.delete = function () {
        $http.post('http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2/deleteFeatures', $scope.postResults, {params: { f: 'json', objectIds: $scope.postResults.objectId} })
        .success(function(res){
          console.log(res);
          $scope.deleteResults = res.deleteResults[0];
          $scope.postResults.success = false;
        })
        .error(function(err){
          if(err){
            console.log(err);
          }
        });
			};
    },
		controllerAs: 'form'
	};
});