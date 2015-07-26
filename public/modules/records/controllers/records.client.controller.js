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
 * getOptions():
 * - should request and return options in promise,
 * getOptItems(option):
 * - should request and return option items (authored) in promise,
 * getTypes()
 * - should set $scope.types (TO DO request types)
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
angular.module('records').controller('RecordsController',
  ['$scope', '$stateParams', '$state', '$q', 'Authentication', 'Records', 'Options', 'OptItems',
	function($scope, $stateParams, $state, $q, Authentication, Records, Options, OptItems) {
		$scope.authentication = Authentication;

    /**
    * init():
    * - should call $scope.getOptions(),
    * - should record.GET if recordId is provided (through stateParams) and set $scope.record
    * - should redirect to list providing message, and skip its step from history on error response
    * - should initiate $scope.record if no recordId is provided (through stateParams)
    * - should clear $scope`s data like: items and values arrays if record not loaded
    * - should set items distributing among options
    */
		$scope.init = function() {
      //initiate options
      $scope.getOptions();
      //initiate items
      var itemsDefer = $q.defer();
      $scope.items = {};
      $scope.options.$promise.then(function(options) {
        angular.forEach($scope.options, function (option) {
          $scope.items[option._id] = [];
        });
        itemsDefer.resolve($scope.items);
      });
      //initiate record
			if ($stateParams.recordId){
        $scope.record = Records.get(
          {
            recordId: $stateParams.recordId
          },
          function (val, responseHeaders) {
            //redistribute items to scope items
            itemsDefer.promise.then(function(items){
              angular.forEach(val.items, function(itm){
                $scope.items[itm.option].push(itm);
              });
            });
          },
          function (httpResponse) {
            $state.go('record.list', {message: httpResponse.status+','+httpResponse.data});
          }
        );
      } else {
        $scope.record = new Records({items:[], values:[]});
        $scope.values = [];
      }
		};

    /**
    * send():
    * - should record.POST $scope.record data if it has no _id and redirect to view using _id from response
    * - should record.PUT $scope.record data if it has _id and redirect to view
    * - should compose scope.items into scope.record.items
    */
    $scope.send = function() {
      $scope.record.items = [];
      angular.forEach($scope.items,(function(opt){
        $scope.record.items = $scope.record.items.concat(
          opt.map(function(item){return item._id})
        );
      }));
      if ($scope.record._id) {
        $scope.record.$update(function() {
          $state.go('record.one.view', {recordId: $scope.record._id});
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
          $state.go('record.list');
        });
      }
    };

    /**
    * list():
    * - should record.GET and set to $scope.records
     */
    $scope.list = function() {
      $scope.message = $stateParams.message;
      $scope.records = Records.query();
    };

    /**
    * getOptions():
    * - should request and return options in promise,
    */
    $scope.getOptions = function() {
//      return Options.query().$promise;
      $scope.options = Options.query();
    };

    /**
    * getOptItems(option):
    * - should request and return option items (authored) in promise,
    */
    $scope.getOptItems = function(option) {
      return OptItems.query({optionId: option._id}).$promise;
    };

    /**
    * getTypes()
    * - should set $scope.types (TO DO request types)
    */
    $scope.getTypes = function(){
      $scope.types = [{_id:'tp1', title:'type 1'}, {_id:'tp2', title:'type 2'}];
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
    * editValue(value):
    * - should set $scope.mode to 'editValue'
     */
    $scope.editValue = function(value){
      if (!value) $scope.record.values.push('');
    };

    /**
    * setValue():
    * - should push $scope.value to $scope.values
    */
	}
]);