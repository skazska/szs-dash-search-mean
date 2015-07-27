'use strict';

/**
 * Routes
 * @param app
 *
 * /types
 *  get - returns list
 *  post - creates type and returns it
 * /types/:typeId
 *  get - returns type by _id
 *  put - update type by _id
 *  delete - removes type
 */
module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var types = require('../../app/controllers/types.server.controller');

	// Types Routes
	app.route('/types')
		.get(types.list)
		.post(users.requiresLogin, types.create);

	app.route('/types/:typeId')
		.get(types.read)
		.put(users.requiresLogin, types.hasAuthorization, types.update)
		.delete(users.requiresLogin, types.hasAuthorization, types.delete);

	// Finish by binding the Type middleware
	app.param('typeId', types.typeByID);
};
