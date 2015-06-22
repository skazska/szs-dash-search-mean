'use strict';

(function() {
	// Opt items Controller Spec
	describe('Opt items Controller Tests', function() {
		// Initialize global variables
		var OptItemsController,
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

			// Initialize the Opt items controller.
			OptItemsController = $controller('OptItemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Opt item object fetched from XHR', inject(function(OptItems) {
			// Create sample Opt item using the Opt items service
			var sampleOptItem = new OptItems({
				name: 'New Opt item'
			});

			// Create a sample Opt items array that includes the new Opt item
			var sampleOptItems = [sampleOptItem];

			// Set GET response
			$httpBackend.expectGET('opt-items').respond(sampleOptItems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.optItems).toEqualData(sampleOptItems);
		}));

		it('$scope.findOne() should create an array with one Opt item object fetched from XHR using a optItemId URL parameter', inject(function(OptItems) {
			// Define a sample Opt item object
			var sampleOptItem = new OptItems({
				name: 'New Opt item'
			});

			// Set the URL parameter
			$stateParams.optItemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/opt-items\/([0-9a-fA-F]{24})$/).respond(sampleOptItem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.optItem).toEqualData(sampleOptItem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(OptItems) {
			// Create a sample Opt item object
			var sampleOptItemPostData = new OptItems({
				name: 'New Opt item'
			});

			// Create a sample Opt item response
			var sampleOptItemResponse = new OptItems({
				_id: '525cf20451979dea2c000001',
				name: 'New Opt item'
			});

			// Fixture mock form input values
			scope.name = 'New Opt item';

			// Set POST response
			$httpBackend.expectPOST('opt-items', sampleOptItemPostData).respond(sampleOptItemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Opt item was created
			expect($location.path()).toBe('/opt-items/' + sampleOptItemResponse._id);
		}));

		it('$scope.update() should update a valid Opt item', inject(function(OptItems) {
			// Define a sample Opt item put data
			var sampleOptItemPutData = new OptItems({
				_id: '525cf20451979dea2c000001',
				name: 'New Opt item'
			});

			// Mock Opt item in scope
			scope.optItem = sampleOptItemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/opt-items\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/opt-items/' + sampleOptItemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid optItemId and remove the Opt item from the scope', inject(function(OptItems) {
			// Create new Opt item object
			var sampleOptItem = new OptItems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Opt items array and include the Opt item
			scope.optItems = [sampleOptItem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/opt-items\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOptItem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.optItems.length).toBe(0);
		}));
	});
}());