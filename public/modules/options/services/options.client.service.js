'use strict';

//Options service used to communicate Options REST endpoints
angular.module('options').factory('Options', ['$resource', 'Cfg',
	function($resource, Cfg) {
    return $resource(Cfg('search_url', '')+'options/:optionId', { optionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      getItems: {
        method: 'GET',
        url: Cfg('search_url', '')+'options/:optionId/items',
        isArray: true
      }
		});
	}
]);