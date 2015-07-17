'use strict';

// Opt items controller
angular.module('opt-items').controller('OptItemsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'OptItems',
	function($scope, $state, $stateParams, $location, Authentication, OptItems) {
		$scope.authentication = Authentication;
    $scope.state = $state;
    $scope.init = function(opt){ if (opt) {$scope._option = opt;} };
    $scope.option = {
      _id:function(val) {
        return $stateParams.optionId || (angular.isObject($scope.$parent.option)?$scope.$parent.option._id:null);
      },
      title:function(val) {
        return $scope.$parent.option.title;
      },
      user:function(val) {
        return $scope.$parent.option.user;
      }
    };
		// Create new Opt item
		$scope.create = function() {
			// Create new Opt item object
			var optItem = new OptItems ({
        id: this.id,
        title: this.title,
        description: this.description,
        logo: this.logo
			});

			// Redirect after save
			optItem.$save({optionId: $scope.option._id()}, function(response) {
        $state.go('option.one.item.list');//, {optionId: $scope.option._id()});
				// Clear form fields
        $scope.id = '';
				$scope.title = '';
        $scope.description = '';
        $scope.logo = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Opt item
		$scope.remove = function(optItem) {
			if ( optItem ) { 
				optItem.$remove();

				for (var i in $scope.optItems) {
					if ($scope.optItems [i] === optItem) {
						$scope.optItems.splice(i, 1);
					}
				}
			} else {
				$scope.optItem.$remove(function() {
          $state.go('option.one.item.list');
				});
			}
		};

		// Update existing Opt item
		$scope.update = function() {
			var optItem = $scope.optItem;

			optItem.$update(function() {
        $state.go('option.one.item.list');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Opt items
		$scope.find = function() {
//			var params;
//      if ($scope.$parent.option) { params = {optionId: $scope.$parent.option._id} }
      $scope.optItems = OptItems.query({optionId: $scope.option._id()});// $stateParams.optionId});

		};

		// Find existing Opt item
		$scope.findOne = function() {
			$scope.optItem = OptItems.get({
        optionId: $scope.option._id(), //$stateParams.optionId,
        optItemId: $stateParams.optItemId
			});
		};
	}
]);