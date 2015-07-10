'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var optItems = require('../controllers/opt-items.server.controller.js');

	// Opt items Routes
	app.route('/opt-items')
		.get(optItems.list)
		.post(users.requiresLogin, optItems.create);

	app.route('/opt-items/:optItemId')
		.get(optItems.read)
		.put(users.requiresLogin, optItems.hasAuthorization, optItems.update)
		.delete(users.requiresLogin, optItems.hasAuthorization, optItems.delete);

  app.route('/options/:optionId/items/:optItemId')
    .get(optItems.read)
    .put(users.requiresLogin, optItems.hasAuthorization, optItems.update)
    .delete(users.requiresLogin, optItems.hasAuthorization, optItems.delete);

  app.route('/options/:optionId/items')
    .get(optItems.list)
    .post(users.requiresLogin, optItems.create);

  // Finish by binding the Opt item middleware
	app.param('optItemId', optItems.optItemByID);
};
