'use strict';

//Opt items service used to communicate Opt items REST endpoints
angular.module('opt-items').factory('OptItems', ['$resource', 'Cfg',
	function($resource, Cfg) {
		return $resource(Cfg('search_url')+'opt-items/:optItemId', { optItemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);