'use strict';

/**
 * Routes
 * @param app
 *
 * /records
 *  get - returns list
 *  post - creates record and returns it
 * /records/:recordId
 *  get - returns record by _id
 *  put - update record by _id
 *  delete - removes record
 */

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var records = require('../controllers/records.server.controller.js');

	// Records Routes
	app.route('/records')
		.get(records.list)
		.post(users.requiresLogin, records.create);

	app.route('/records/:recordId')
		.get(users.requiresLogin, records.hasAuthorization, records.read)
		.put(users.requiresLogin, records.hasAuthorization, records.update)
		.delete(users.requiresLogin, records.hasAuthorization, records.delete);

	// Finish by binding the Record middleware
	app.param('recordId', records.recordByID);
};
