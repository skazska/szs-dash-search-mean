'use strict';

//Records service used to communicate Records REST endpoints
angular.module('records').factory('Records', ['$resource', 'Cfg',
	function($resource, Cfg) {
		return $resource(Cfg('search_url')+'records/:recordId', { recordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);