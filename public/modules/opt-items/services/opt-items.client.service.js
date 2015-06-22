'use strict';

//Opt items service used to communicate Opt items REST endpoints
angular.module('opt-items').factory('OptItems', ['$resource',
	function($resource) {
		return $resource('opt-items/:optItemId', { optItemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);