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


(function() {
	// Records Controller Spec
	describe('Records Controller Tests', function() {
		// Initialize global variables
		var RecordsController,
		  scope,
		  $httpBackend,
		  $stateParams,
      $state,
		  $location,
      Records,
      urlPrefix,
      record,
      recordData;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

    beforeEach(module('templates'));
		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$state_, _$httpBackend_, _Records_, Cfg) {
			// Set a new global scope
      Records = _Records_;
      scope = $rootScope.$new();
      urlPrefix = Cfg('search_url');
      recordData = {
        type: 'tp',
        items: ['Item1', 'Item2'],
        values: ['val1', 'val2']
      };
      record = new Records(recordData);

			// Point global variables to injected services
			$state = _$state_;
      $stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Records controller.
			RecordsController = $controller('RecordsController', {
				$scope: scope
			});


		}));

    describe('$scope.init()', function(){
//      beforeEach(inject(function($rootScope){
//      }));
      it('should record.GET if recordId is provided (through stateParams) and set $scope.record',function(){
        $stateParams.recordId = 'RID';
        $httpBackend.expectGET(urlPrefix+'records/'+$stateParams.recordId)
          .respond(record);
        scope.init();
        $httpBackend.flush();
        expect(scope.record).toEqualData(recordData);
      });
      it('should redirect to list providing message, and skip its step from history',inject(function($window){
        $stateParams.recordId = 'RID';
        $httpBackend.expectGET(urlPrefix+'records/RID')
          .respond(403, 'forbidden');
        scope.init();
        $httpBackend.flush();
        expect($location.path()).toBe('/records/list');
        expect($stateParams.message).toBe('403, forbidden')
        expect($window.history.length).toBe(1);
      }));
      it('should initiate $scope.record if no recordId is provided (through stateParams)',function(){
        $httpBackend.expectGET(urlPrefix+'records/RID')
          .respond(403, 'forbidden');
        scope.init();
        expect($httpBackend.flush).toThrow();
        expect(scope.record).toEqualData({items:[], values:[]})
      });
      it('should clear $scope`s data like: options and values arrays',function(){
        scope.options = ['opt'];
        scope.values = ['val'];
        scope.init();
        expect(scope.options).toEqualData([]);
        expect(scope.values).toEqualData([]);
      });
    });

    describe('send():', function(){
      it('should record.POST $scope.record data if it has no _id and redirect to view using _id from response', function(){
        scope.record = record;
        $httpBackend.expectPOST(urlPrefix+'records', recordData).respond(200,{_id:'RID'});
        scope.send();
        $httpBackend.flush();
        expect($location.path()).toBe('/records/RID/view');
      });
      it('should record.PUT $scope.record data if it has _id and redirect to view', function(){
        scope.record = record;
        scope.record._id = 'RID';
        recordData._id = 'RID';
        $httpBackend.expectPUT(urlPrefix+'records/RID', recordData).respond(200,{_id:'RID'});
        scope.send();
        $httpBackend.flush();
        expect($location.path()).toBe('/records/RID/view');
      });
    });
    describe('remove(record):', function(){
      it('should record.DELETE $scope.record data and redirect to list if no record provided', function(){
        scope.record = record;
        scope.record._id = 'RID';
        $httpBackend.expectDELETE(urlPrefix+'records/RID').respond(200);
        scope.remove();
        $httpBackend.flush();
        expect($location.path()).toBe('/records/list');

      });
      it('should record.DELETE record data and remove it from $scope.records', function(){
        scope.records = [new Records({_id:'R1'}), new Records({_id:'R2'})];
        $httpBackend.expectDELETE(urlPrefix+'records/R1').respond(200);
        scope.remove(scope.records[0]);
        $httpBackend.flush();
        expect(scope.records.length).toBe(1);
        expect(scope.records[0]._id).toBe('R2');
      });
    });
    describe('list():', function(){
      it('should record.GET and set to $scope.records', function(){
        var records = [new Records({_id:'R1'}), new Records({_id:'R2'})];
        $httpBackend.expectGET(urlPrefix+'records')
          .respond(records);
        scope.init();
        $httpBackend.flush();
        expect(scope.records).toEqualData(records);
      });
    });
    describe('addOption(option):', function() {
      it('should push option into $scope.options', function () {

      });
    });
    describe('delOption(option):', function() {
      it('should remove option from $scope.options', function () {

      });
    });
    describe('editValue():', function() {
      it('should set $scope.mode to "editValue"', function () {

      });
    });
    describe('setValue():', function() {
      it('should push $scope.value to $scope.values', function () {

      });
    });
	});
}());