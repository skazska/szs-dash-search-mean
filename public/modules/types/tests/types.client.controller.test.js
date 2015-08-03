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
(function() {
	// Types Controller Spec
	describe('Types Controller Tests', function() {
		// Initialize global variables
		var TypesController,
			scope,
			$httpBackend,
			$stateParams,
			$state,
			$location,
			Types,
			urlPrefix,
			type,
			typeData,
			itemsData,
			options;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$state_, _$httpBackend_, _Types_, Cfg) {
			// Set a new global scope
			Types = _Types_;
			scope = $rootScope.$new();
			urlPrefix = Cfg('search_url');

			typeData = {
				title: 'Title',
			  viewInListTpl: 'ViewInListTpl',
				viewTpl: 'viewTpl',
			  editTpl: 'editTpl',
				modelValidator: 'modelValidator'
			};
			type = new Types(typeData);

			// Point global variables to injected services
			$state = _$state_;
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Types controller.
			TypesController = $controller('TypesController', {
				$scope: scope
			});


		}));

		describe('$scope.init()', function(){
			it('should type.GET if typeId is provided (through stateParams) and set $scope.type',function(){
				$stateParams.typeId = 'RID';
				$httpBackend.expectGET(urlPrefix+'types/'+$stateParams.typeId)
					.respond(type);
				scope.init();
				$httpBackend.flush();
				expect(scope.type).toEqualData(typeData);
			});
			it('should redirect to list providing message, and skip its step from history',inject(function($window){
				$stateParams.typeId = 'RID';
				$httpBackend.expectGET(urlPrefix+'types/RID')
					.respond(403, 'forbidden');
				scope.init();
				$httpBackend.flush();
				expect($location.path()).toBe('/types/list');
//        expect($scope.massage()).toBe('403, forbidden');
				expect($window.history.length).toBe(1);
			}));
			it('should initiate $scope.type if no typeId is provided (through stateParams)',function(){
				$httpBackend.expectGET(urlPrefix+'types/RID')
					.respond(403, 'forbidden');
				scope.init();
				expect($httpBackend.flush).toThrow();
				expect(scope.type).toEqualData({})
			});
		});

		describe('send():', function(){
			var typeSend;
			beforeEach(function(){
				scope.type = type;
				typeSend = angular.copy(typeData);
			});
			it('should type.POST $scope.type data if it has no _id and redirect to view using _id from response', function(){
				$httpBackend.expectPOST(urlPrefix+'types', typeSend).respond(200,{_id:'RID'});
				scope.send();
				$httpBackend.flush();
				expect($location.path()).toBe('/types/RID/view');
			});
			it('should type.PUT $scope.type data if it has _id and redirect to view', function(){
				scope.type._id = 'RID';
				typeSend._id = 'RID';
				$httpBackend.expectPUT(urlPrefix+'types/RID', typeSend).respond(200,{_id:'RID'});
				scope.send();
				$httpBackend.flush();
				expect($location.path()).toBe('/types/RID/view');
			});
		});
		describe('remove(type):', function(){
			it('should type.DELETE $scope.type data and redirect to list if no type provided', function(){
				scope.type = type;
				scope.type._id = 'RID';
				$httpBackend.expectDELETE(urlPrefix+'types/RID').respond(200);
				scope.remove();
				$httpBackend.flush();
				expect($location.path()).toBe('/types/list');

			});
			it('should type.DELETE type data and remove it from $scope.types', function(){
				scope.types = [new Types({_id:'R1'}), new Types({_id:'R2'})];
				$httpBackend.expectDELETE(urlPrefix+'types/R1').respond(200);
				scope.remove(scope.types[0]);
				$httpBackend.flush();
				expect(scope.types.length).toBe(1);
				expect(scope.types[0]._id).toBe('R2');
			});
		});
		describe('list():', function(){
			it('should type.GET and set to $scope.types', function(){
				var types = [new Types({_id:'R1'}), new Types({_id:'R2'})];
				$httpBackend.expectGET(urlPrefix+'types')
					.respond(types);
				scope.list();
				$httpBackend.flush();
				expect(scope.types).toEqualData(types);
			});
		});
	});
}());