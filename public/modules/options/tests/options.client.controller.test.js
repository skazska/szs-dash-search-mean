'use strict';

(function() {
	// Options Controller Spec
	describe('Options Controller Tests', function() {
		// Initialize global variables
		var OptionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

    var Cfg;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Cfg_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

      // Config
      Cfg = _Cfg_;

			// Initialize the Options controller.
			OptionsController = $controller('OptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Option object fetched from XHR', inject(function(Options) {
			// Create sample Option using the Options service
			var sampleOption = new Options({
        id: 'opt',
        title: 'title',
        description: 'description',
        logo: 'logo'
			});

			// Create a sample Options array that includes the new Option
			var sampleOptions = [sampleOption];

			// Set GET response
			$httpBackend.expectGET(Cfg('search_url','')+'options').respond(sampleOptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.options).toEqualData(sampleOptions);
		}));

		it('$scope.findOne() should create an array with one Option object fetched from XHR using a optionId URL parameter', inject(function(Options) {
			// Define a sample Option object
			var sampleOption = new Options({
        id: 'opt',
        title: 'title',
        description: 'description',
        logo: 'logo'
			});

			// Set the URL parameter
			$stateParams.optionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
      var rx = new RegExp(Cfg('search_url','')+'options\/([0-9a-fA-F]{24})$');
			$httpBackend.expectGET(rx).respond(sampleOption);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.option).toEqualData(sampleOption);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Options) {
			// Create a sample Option object
			var sampleOptionPostData = new Options({
        id: 'opt',
        title: 'title',
        description: 'description',
        logo: 'logo'
			});

			// Create a sample Option response
			var sampleOptionResponse = new Options({
				_id: '525cf20451979dea2c000001',
        id: 'opt',
        title: 'title',
        description: 'description',
        logo: 'logo'
			});

			// Fixture mock form input values
      scope.id = 'opt';
      scope.title = 'title';
      scope.description = 'description';
      scope.logo = 'logo';

			// Set POST response
			$httpBackend.expectPOST(Cfg('search_url','')+'options', sampleOptionPostData).respond(sampleOptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.id).toEqual('opt');
      expect(scope.title).toEqual('title');
      expect(scope.description).toEqual('description');
      expect(scope.logo).toEqual('logo');

			// Test URL redirection after the Option was created
			expect($location.path()).toBe('/'+Cfg('search_url','')+'options/' + sampleOptionResponse._id);
		}));

		it('$scope.update() should update a valid Option', inject(function(Options) {
			// Define a sample Option put data
			var sampleOptionPutData = new Options({
				_id: '525cf20451979dea2c000001',
        id: 'opt',
        title: 'title',
        description: 'description',
        logo: 'logo'
			});

			// Mock Option in scope
			scope.option = sampleOptionPutData;

			// Set PUT response
      var rx = new RegExp(Cfg('search_url','')+'options\/([0-9a-fA-F]{24})$');
      $httpBackend.expectPUT(rx).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/'+Cfg('search_url','')+'options/' + sampleOptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid optionId and remove the Option from the scope', inject(function(Options) {
			// Create new Option object
			var sampleOption = new Options({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Options array and include the Option
			scope.options = [sampleOption];

			// Set expected DELETE response
      var rx = new RegExp(Cfg('search_url','')+'options\/([0-9a-fA-F]{24})$');
      $httpBackend.expectDELETE(rx).respond();

			// Run controller functionality
			scope.remove(sampleOption);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.options.length).toBe(0);
		}));
	});
}());