'use strict';

// Opt items controller
angular.module('opt-items').controller('OptItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'OptItems',
	function($scope, $stateParams, $location, Authentication, OptItems) {
		$scope.authentication = Authentication;

		// Create new Opt item
		$scope.create = function() {
			// Create new Opt item object
			var optItem = new OptItems ({
				name: this.name
			});

			// Redirect after save
			optItem.$save(function(response) {
				$location.path('opt-items/' + response._id);

				// Clear form fields
				$scope.name = '';
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
			$scope.optItems = OptItems.query();
		};

		// Find existing Opt item
		$scope.findOne = function() {
			$scope.optItem = OptItems.get({ 
				optItemId: $stateParams.optItemId
			});
		};
	}
]);