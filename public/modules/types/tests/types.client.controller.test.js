'use strict';

(function() {
	// Types Controller Spec
	describe('Types Controller Tests', function() {
		// Initialize global variables
		var TypesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

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

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Types controller.
			TypesController = $controller('TypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Type object fetched from XHR', inject(function(Types) {
			// Create sample Type using the Types service
			var sampleType = new Types({
				name: 'New Type'
			});

			// Create a sample Types array that includes the new Type
			var sampleTypes = [sampleType];

			// Set GET response
			$httpBackend.expectGET('types').respond(sampleTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.types).toEqualData(sampleTypes);
		}));

		it('$scope.findOne() should create an array with one Type object fetched from XHR using a typeId URL parameter', inject(function(Types) {
			// Define a sample Type object
			var sampleType = new Types({
				name: 'New Type'
			});

			// Set the URL parameter
			$stateParams.typeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/types\/([0-9a-fA-F]{24})$/).respond(sampleType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.type).toEqualData(sampleType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Types) {
			// Create a sample Type object
			var sampleTypePostData = new Types({
				name: 'New Type'
			});

			// Create a sample Type response
			var sampleTypeResponse = new Types({
				_id: '525cf20451979dea2c000001',
				name: 'New Type'
			});

			// Fixture mock form input values
			scope.name = 'New Type';

			// Set POST response
			$httpBackend.expectPOST('types', sampleTypePostData).respond(sampleTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Type was created
			expect($location.path()).toBe('/types/' + sampleTypeResponse._id);
		}));

		it('$scope.update() should update a valid Type', inject(function(Types) {
			// Define a sample Type put data
			var sampleTypePutData = new Types({
				_id: '525cf20451979dea2c000001',
				name: 'New Type'
			});

			// Mock Type in scope
			scope.type = sampleTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/types/' + sampleTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid typeId and remove the Type from the scope', inject(function(Types) {
			// Create new Type object
			var sampleType = new Types({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Types array and include the Type
			scope.types = [sampleType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.types.length).toBe(0);
		}));
	});
}());