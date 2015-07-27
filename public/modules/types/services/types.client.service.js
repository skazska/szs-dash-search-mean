'use strict';

//Types service used to communicate Types REST endpoints
angular.module('types').factory('Types', ['$resource',
	function($resource) {
		return $resource('types/:typeId', { typeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);