'use strict';

angular.module('mean').controller('ContactCtrl', ['$scope',function ($scope) {
	$scope.contact = {
			name: 'Brian Alford',
			email: 'Brian.Alford@raleighnc.gov',
			phone: '919-996-4099',
			photo: '/packages/articles/public/assets/img/City-Seal-2color.png'
		};

}]);