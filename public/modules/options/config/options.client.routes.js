'use strict';

//Setting up route
angular.module('options').config(['$stateProvider',
	function($stateProvider) {
		// Options state routing
		$stateProvider
      .state('option', {
        abstract: true,
        url: '/options',
        templateUrl: 'modules/options/views/option.client.view.html'
      })
      .state('option.view', {
        url: '/:optionId/view',
        templateUrl: 'modules/options/views/view-option.client.view.html'
      })
      .state('option.list', {
        url: '/list',
        templateUrl: 'modules/options/views/list-option.client.view.html'
      })
      .state('option.create', {
        url: '/create',
        templateUrl: 'modules/options/views/create-option.client.view.html'
      })
      .state('option.edit', {
        url: '/:optionId/edit',
        templateUrl: 'modules/options/views/edit-option.client.view.html'
      })
      .state('option.delete', {
        url: '/:optionId/delete',
        templateUrl: 'modules/options/views/del-option.client.view.html'
      })
    ;
	}
]);