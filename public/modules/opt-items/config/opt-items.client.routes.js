'use strict';

//Setting up route
angular.module('opt-items').config(['$stateProvider',
	function($stateProvider) {
		// Opt items state routing
		$stateProvider.
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
    state('option.item.edit', {
      url: '/items/:optItemId/edit',
      templateUrl: 'modules/opt-items/views/edit-opt-item.client.view.html'
    });
    state('option.item.delete', {
      url: '/items/:optItemId/delete',
      templateUrl: 'modules/opt-items/views/del-opt-item.client.view.html'
    });
	}
]);