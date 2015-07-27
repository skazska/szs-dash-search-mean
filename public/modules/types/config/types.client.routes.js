'use strict';

//Setting up route
angular.module('types').config(['$stateProvider',
	function($stateProvider) {
		// Types state routing
		$stateProvider.
		state('listTypes', {
			url: '/types',
			templateUrl: 'modules/types/views/list-types.client.view.html'
		}).
		state('createType', {
			url: '/types/create',
			templateUrl: 'modules/types/views/create-type.client.view.html'
		}).
		state('viewType', {
			url: '/types/:typeId',
			templateUrl: 'modules/types/views/view-type.client.view.html'
		}).
		state('editType', {
			url: '/types/:typeId/edit',
			templateUrl: 'modules/types/views/edit-type.client.view.html'
		});
	}
]);