'use strict';

// Types controller
angular.module('types').controller('TypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Types',
	function($scope, $stateParams, $location, Authentication, Types) {
		$scope.authentication = Authentication;

		// Create new Type
		$scope.create = function() {
			// Create new Type object
			var type = new Types ({
				name: this.name
			});

			// Redirect after save
			type.$save(function(response) {
				$location.path('types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Type
		$scope.remove = function(type) {
			if ( type ) { 
				type.$remove();

				for (var i in $scope.types) {
					if ($scope.types [i] === type) {
						$scope.types.splice(i, 1);
					}
				}
			} else {
				$scope.type.$remove(function() {
					$location.path('types');
				});
			}
		};

		// Update existing Type
		$scope.update = function() {
			var type = $scope.type;

			type.$update(function() {
				$location.path('types/' + type._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Types
		$scope.find = function() {
			$scope.types = Types.query();
		};

		// Find existing Type
		$scope.findOne = function() {
			$scope.type = Types.get({ 
				typeId: $stateParams.typeId
			});
		};
	}
]);