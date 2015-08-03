'use strict';

//Setting up route
angular.module('types').config(['$stateProvider',
	function($stateProvider) {
		// Types state routing
		$stateProvider
			.state('type', {
				abstract: true,
				url: '/types',
				templateUrl: 'modules/types/views/type.client.view.html'
			})
			.state('type.list', {
				url: '/list',
				templateUrl: 'modules/types/views/list-type.client.view.html'
			})
			.state('type.one', {
				abstract: true,
//				url: '/:typeId',
				templateUrl: 'modules/types/views/one-type.client.view.html'
			})
			.state('type.one.create', {
				url: '/create',
				templateUrl: 'modules/types/views/edit-type.client.view.html'
			})
			.state('type.one.view', {
				url: '/:typeId/view',
				templateUrl: 'modules/types/views/view-type.client.view.html'
			})
			.state('type.one.edit', {
				url: '/:typeId/edit',
				templateUrl: 'modules/types/views/edit-type.client.view.html'
			})
			.state('type.one.view.delete', {
				url: '/:typeId/delete',
				templateUrl: 'modules/types/views/del-type.client.view.html'
			})
		;
	}
]);