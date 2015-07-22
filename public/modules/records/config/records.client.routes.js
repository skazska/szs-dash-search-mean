'use strict';

//Setting up route
angular.module('records').config(['$stateProvider',
	function($stateProvider) {
		// Records state routing
		$stateProvider
			.state('record', {
				abstract: true,
				url: '/records',
				templateUrl: 'modules/records/views/record.client.view.html'
			})
			.state('record.list', {
				url: '/list',
				templateUrl: 'modules/records/views/list-record.client.view.html'
			})
			.state('record.create', {
				url: '/create',
				templateUrl: 'modules/records/views/edit-record.client.view.html'
			})
			.state('record.one', {
				abstract: true,
				url: '/:optionId',
				templateUrl: 'modules/records/views/one-record.client.view.html'
			})
			.state('record.one.view', {
				url: '/view',
				templateUrl: 'modules/records/views/view-record.client.view.html'
			})
			.state('record.one.edit', {
				url: '/edit',
				templateUrl: 'modules/records/views/edit-record.client.view.html'
			})
			.state('record.one.delete', {
				url: '/delete',
				templateUrl: 'modules/records/views/del-record.client.view.html'
			})
		;
	}
]);