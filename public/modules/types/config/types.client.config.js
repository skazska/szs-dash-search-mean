'use strict';

// Configuring the Articles module
angular.module('types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Types', 'types', 'dropdown', 'type.one.create');
		Menus.addSubMenuItem('topbar', 'types', 'List Types', 'type.list');
		Menus.addSubMenuItem('topbar', 'types', 'New Type', 'type.one.create');
	}
]);