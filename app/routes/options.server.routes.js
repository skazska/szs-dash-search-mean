'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var options = require('../../app/controllers/options.server.controller');

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
