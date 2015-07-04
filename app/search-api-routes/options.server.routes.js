'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var options = require('../controllers/options.server.controller.js');

	// Options Routes
	app.route('/options')
		.get(options.list)
		.post(users.requiresLogin, options.create);

	app.route('/options/:optionId')
		.get(options.read)
		.put(users.requiresLogin, options.hasAuthorization, options.update)
		.delete(users.requiresLogin, options.hasAuthorization, options.delete);

	// Finish by binding the Option middleware
	app.param('optionId', options.optionByID);
};
