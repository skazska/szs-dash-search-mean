'use strict';

//Setting up route
angular.module('opt-items').config(['$stateProvider',
	function($stateProvider) {
		// Opt items state routing
		$stateProvider.
		state('listOptItems', {
			url: '/opt-items',
			templateUrl: 'modules/opt-items/views/list-opt-items.client.view.html'
		}).
		state('createOptItem', {
			url: '/opt-items/create',
			templateUrl: 'modules/opt-items/views/create-opt-item.client.view.html'
		}).
		state('viewOptItem', {
			url: '/opt-items/:optItemId',
			templateUrl: 'modules/opt-items/views/view-opt-item.client.view.html'
		}).
		state('editOptItem', {
			url: '/opt-items/:optItemId/edit',
			templateUrl: 'modules/opt-items/views/edit-opt-item.client.view.html'
		}).

    state('option.item', {
      templateUrl: 'modules/opt-items/views/opt-item.client.view.html'
    }).
    state('option.item.list', {
      url: '/items',
      templateUrl: 'modules/opt-items/views/list-opt-item.client.view.html'
    }).
    state('option.item.create', {
      url: '/items/create',
      templateUrl: 'modules/opt-items/views/create-opt-item.client.view.html'
    }).

    state('option.items', {
      url: '/items',
      templateUrl: 'modules/opt-items/views/opt-items.client.view.html'
    }).
    state('option.items.create', {
      url: '/create',
      templateUrl: 'modules/opt-items/views/create-opt-items.client.view.html'
    }).
    state('option.items.edit', {
      url: '/:optItemId/edit',
      templateUrl: 'modules/opt-items/views/edit-opt-items.client.view.html'
    });
	}
]);