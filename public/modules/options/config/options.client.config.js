'use strict';

// Configuring the Articles module
angular.module('options').run(['Menus',
	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Options', 'options', 'dropdown', '/options(/create)?');
//		Menus.addSubMenuItem('topbar', 'options', 'List Options', 'options');
//		Menus.addSubMenuItem('topbar', 'options', 'New Option', 'options/create');
    Menus.addMenuItem('topbar', 'Options', 'options', 'dropdown', 'option.create');
    Menus.addSubMenuItem('topbar', 'options', 'List Options', 'option.list');
    Menus.addSubMenuItem('topbar', 'options', 'New Option', 'option.create');

  }
]);