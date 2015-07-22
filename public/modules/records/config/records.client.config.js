'use strict';

// Configuring the Articles module
angular.module('records').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Records', 'records', 'dropdown', 'record.create');
		Menus.addSubMenuItem('topbar', 'records', 'List Records', 'record.list');
		Menus.addSubMenuItem('topbar', 'records', 'New Record', 'record.create');
	}
]);