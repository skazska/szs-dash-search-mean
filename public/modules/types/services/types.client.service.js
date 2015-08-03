'use strict';

//Types service used to communicate Types REST endpoints
angular.module('types').factory('Types', ['$resource', 'Cfg',
	function($resource, Cfg) {
		return $resource(Cfg('search_url')+'types/:typeId', { typeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);