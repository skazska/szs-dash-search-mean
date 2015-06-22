'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var optItems = require('../../app/controllers/opt-items.server.controller');

	// Opt items Routes
	app.route('/opt-items')
		.get(optItems.list)
		.post(users.requiresLogin, optItems.create);

	app.route('/opt-items/:optItemId')
		.get(optItems.read)
		.put(users.requiresLogin, optItems.hasAuthorization, optItems.update)
		.delete(users.requiresLogin, optItems.hasAuthorization, optItems.delete);

	// Finish by binding the Opt item middleware
	app.param('optItemId', optItems.optItemByID);
};
