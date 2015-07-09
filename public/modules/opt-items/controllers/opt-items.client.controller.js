'use strict';

function getterSetter(cont1, cont2, field, val){
  if (!cont1) {
    if (val) { return cont2[field] = val; }
    else { return cont2[field]; }
  } else {
    if (val) { return cont1[field] = val; }
    else { return cont1[field]; }
  }

}

// Opt items controller
angular.module('opt-items').controller('OptItemsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'OptItems',
	function($scope, $state, $stateParams, $location, Authentication, OptItems) {
		$scope.authentication = Authentication;
    $scope.init = function(opt){ if (opt) {$scope._option = opt;} };
    $scope.option = {
      _id:function(val) {
        return $stateParams.optionId || getterSetter($scope._option, $scope.$parent.option, '_id', val);
      },
      title:function(val) {
        return getterSetter($scope._option, $scope.$parent.option, 'title', val);
      }
    };
		// Create new Opt item
		$scope.create = function() {
			// Create new Opt item object
			var optItem = new OptItems ({
//        option: this.option._id(),
        title: this.title,
        description: this.description,
        logo: this.logo
			});

			// Redirect after save
			optItem.$save({optionId: $scope.option._id()}, function(response) {
//				$location.path('/opt-items/' + response._id);
        $state.go('option.item.list');
				// Clear form fields
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
					$location.path('opt-items');
				});
			}
		};

		// Update existing Opt item
		$scope.update = function() {
			var optItem = $scope.optItem;

			optItem.$update(function() {
				$location.path('opt-items/' + optItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Opt items
		$scope.find = function() {
//			var params;
//      if ($scope.$parent.option) { params = {optionId: $scope.$parent.option._id} }
      $scope.optItems = OptItems.query({optionId: $stateParams.optionId});

		};

		// Find existing Opt item
		$scope.findOne = function() {
			$scope.optItem = OptItems.get({ 
				optItemId: $stateParams.optItemId
			});
		};
	}
]);