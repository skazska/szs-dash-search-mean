'use strict';
/**
 * Records module client controller tests
 * Methods:
 * init():
 * - should record.GET if recordId is provided (through stateParams) and set $scope.record
 * - should redirect to list providing message, and skip its step from history on error response
 * - should initiate $scope.record if no recordId is provided (through stateParams)
 * - should clear $scope`s data like: options and values arrays
 * send():
 * - should record.POST $scope.record data if it has no _id and redirect to view using _id from response
 * - should record.PUT $scope.record data if it has _id and redirect to view
 * remove(record):
 * - should record.DELETE $scope.record data and redirect to list if no record provided
 * - should record.DELETE record data and remove it from $scope.records
 * list():
 * - should record.GET and set to $scope.records
 * addOption(option):
 * -should push option into $scope.options
 * delOption(option):
 * -should remove option from $scope.options
 * editValue():
 * - should set $scope.mode to 'editValue'
 * setValue():
 * - should push $scope.value to $scope.values
 */

/**
 * Record Schema
 * This schema represents the record, record is the main data being of project
 * It consists of:
 * type - value type(schema)
 * actualUntil - a date of expiration
 * items - an Item reference list (Item is a classification atom,
 * represented by an Item Schema) list should contain at least (one) Item
 * values - list of subject data records relevant to the classification set
 * -------------------
 * created, user - technical fields
 */

// Records controller
angular.module('records').controller('RecordsController', ['$scope', '$stateParams', '$state', 'Authentication', 'Records',
	function($scope, $stateParams, $state, Authentication, Records) {
		$scope.authentication = Authentication;

    /**
    * init():
    * - should record.GET if recordId is provided (through stateParams) and set $scope.record
    * - should redirect to list providing message, and skip its step from history on error response
    * - should initiate $scope.record if no recordId is provided (through stateParams)
    * - should clear $scope`s data like: options and values arrays
		*/
		$scope.init = function() {
			if ($stateParams.recordId){
        $scope.record = Records.get(
          {
            recordId: $stateParams.recordId
          },
          function (val, responseHeaders) {

          },
          function (httpResponse) {
            $state.go('record.list', {message: httpResponse.status+','+httpResponse.message});
          }
        );
      } else {
        $scope.record = new Records({items:[], values:[]});
      }
      $scope.options = [];
      $scope.values = [];
		};

    /**
    * send():
    * - should record.POST $scope.record data if it has no _id and redirect to view using _id from response
    * - should record.PUT $scope.record data if it has _id and redirect to view
    */
    $scope.send = function() {
      if ($scope.record._id) {
        $scope.record.$update(function() {
          $state.go('record.one.view');
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      } else {
        // Redirect after save
        $scope.record.$save(function(response) {
          $state.go('record.one.view', {recordId:response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    /**
    * remove(record):
    * - should record.DELETE $scope.record data and redirect to list if no record provided
    * - should record.DELETE record data and remove it from $scope.records
     */
    $scope.remove = function(record) {
      if ( record ) {
        record.$remove();

        for (var i in $scope.records) {
          if ($scope.records [i] === record) {
            $scope.records.splice(i, 1);
          }
        }
      } else {
        $scope.record.$remove(function() {
          $state.go('record.list', {recordId:response._id});
        });
      }
    };

    /**
    * list():
    * - should record.GET and set to $scope.records
     */
    $scope.list = function() {
      $scope.records = Records.query();
    };

    /**
    * addOption(option):
    * -should push option into $scope.options
     */

    /**
    * delOption(option):
    * -should remove option from $scope.options
     */

    /**
    * editValue():
    * - should set $scope.mode to 'editValue'
     */

    /**
    * setValue():
    * - should push $scope.value to $scope.values
    */
	}
]);