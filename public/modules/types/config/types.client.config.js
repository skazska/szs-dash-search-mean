'use strict';

// Configuring the Articles module
angular.module('types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Types', 'types', 'dropdown', '/types(/create)?');
		Menus.addSubMenuItem('topbar', 'types', 'List Types', 'types');
		Menus.addSubMenuItem('topbar', 'types', 'New Type', 'types/create');
	}
]);