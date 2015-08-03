'use strict';

/**
 * Type Schema
 * This schema represents type of type`s values, it should define view and edit
 * templates representing value if front-end
 * It consist of:
 * _id - objectId, builtin, PK - technical identifier
 * title - string, required - name of type
 * viewInListTpl - string, required - name of template to represent value in list
 * viewTpl - string, required - name of template to represent single value
 * editTpl - string, required - name of template to edit single value
 * modelValidator - string, - name of model validator function module
 */

/**
 * Types module client controller tests
 * Methods:
 * init():
 * - should type.GET if typeId is provided (through stateParams) and set $scope.type
 * - should redirect to list providing message, and skip its step from history on error response
 * - should initiate $scope.type if no typeId is provided (through stateParams)
 * send():
 * - should type.POST $scope.type data if it has no _id and redirect to view using _id from response
 * - should type.PUT $scope.type data if it has _id and redirect to view
 * remove(type):
 * - should type.DELETE $scope.type data and redirect to list if no type provided
 * - should type.DELETE type data and remove it from $scope.types
 * list():
 * - should type.GET and set to $scope.types
 */


// Types controller
angular.module('types').controller('TypesController',
	['$scope', '$stateParams', '$state', '$q', 'Authentication', 'Types', 'Options', 'OptItems',
		function($scope, $stateParams, $state, $q, Authentication, Types, Options, OptItems) {
			$scope.authentication = Authentication;

			/**
			 * init():
			 * - should type.GET if typeId is provided (through stateParams) and set $scope.type
			 * - should redirect to list providing message, and skip its step from history on error response
			 * - should initiate $scope.type if no typeId is provided (through stateParams)
			 */
			$scope.init = function() {
				//initiate type
				if ($stateParams.typeId){
					$scope.type = Types.get(
						{
							typeId: $stateParams.typeId
						},
						function (val, responseHeaders) {
						},
						function (httpResponse) {
							$state.go('type.list', {message: httpResponse.status+','+httpResponse.data});
						}
					);
				} else {
					$scope.type = new Types();
				}
			};

			/**
			 * send():
			 * - should type.POST $scope.type data if it has no _id and redirect to view using _id from response
			 * - should type.PUT $scope.type data if it has _id and redirect to view
			 */
			$scope.send = function() {
				if ($scope.type._id) {
					$scope.type.$update(function() {
						$state.go('type.one.view', {typeId: $scope.type._id});
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				} else {
					// Redirect after save
					$scope.type.$save(function(response) {
						$state.go('type.one.view', {typeId:response._id});
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			};

			/**
			 * remove(type):
			 * - should type.DELETE $scope.type data and redirect to list if no type provided
			 * - should type.DELETE type data and remove it from $scope.types
			 */
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
						$state.go('type.list');
					});
				}
			};

			/**
			 * list():
			 * - should type.GET and set to $scope.types
			 */
			$scope.list = function() {
				$scope.message = $stateParams.message;
				$scope.types = Types.query();
			};

		}
	]);