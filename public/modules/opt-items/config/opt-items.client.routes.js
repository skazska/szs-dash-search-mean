'use strict';

//Setting up route
angular.module('opt-items').config(['$stateProvider',
	function($stateProvider) {
		// Opt items state routing
		$stateProvider.
    state('option.one.item', {
      abstract: true,
      url: '/items',
      templateUrl: 'modules/opt-items/views/opt-item.client.view.html'
    }).
    state('option.one.item.view', {
      url: '/:optItemId/view',
      templateUrl: 'modules/opt-items/views/view-opt-item.client.view.html'
    }).
    state('option.one.item.list', {
      url: '/list',
      templateUrl: 'modules/opt-items/views/list-opt-item.client.view.html'
    }).
    state('option.one.item.create', {
      url: '/create',
      templateUrl: 'modules/opt-items/views/create-opt-item.client.view.html'
    }).
    state('option.one.item.edit', {
      url: '/:optItemId/edit',
      templateUrl: 'modules/opt-items/views/edit-opt-item.client.view.html'
    }).
    state('option.one.item.delete', {
      url: '/:optItemId/delete',
      templateUrl: 'modules/opt-items/views/del-opt-item.client.view.html'
    });
	}
]);