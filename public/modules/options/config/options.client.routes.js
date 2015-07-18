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
      .state('option.list', {
        url: '/list',
        templateUrl: 'modules/options/views/list-option.client.view.html'
      })
      .state('option.create', {
        url: '/create',
        templateUrl: 'modules/options/views/create-option.client.view.html'
      })
      .state('option.one', {
        abstract: true,
        url: '/:optionId',
        templateUrl: 'modules/options/views/one-option.client.view.html'
      })
      .state('option.one.view', {
        url: '/view',
        templateUrl: 'modules/options/views/view-option.client.view.html'
      })
      .state('option.one.edit', {
        url: '/edit',
        templateUrl: 'modules/options/views/edit-option.client.view.html'
      })
      .state('option.one.delete', {
        url: '/delete',
        templateUrl: 'modules/options/views/del-option.client.view.html'
      })
    ;
	}
]);