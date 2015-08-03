'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Type = mongoose.model('Type'),
	_ = require('lodash');


/**
 * Type Schema
 * This schema represents type of record`s values, it should define view and edit
 * templates representing value if front-end
 * It consist of:
 * _id - objectId, builtin, PK - technical identifier
 * title - string, required - name of type
 * viewInListTpl - string, required - name of template to represent value in list
 * viewTpl - string, required - name of template to represent single value
 * editTpl - string, required - name of template to edit single value
 * modelValidator - string, - name of model validator function module
 */

/**
 * CREATE: fires on /types POST type_data   uses types.create
 * should respond 400 "???" if data contains _id
 * should respond 400 "Please fill Type title" when POST with no or empty title
 * should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl
 * should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl
 * should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl
 * should respond type_data with _id property being set
 */
exports.create = function(req, res) {
	var type = new Type(req.body);
	type.user = req.user;

	type.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(type);
		}
	});
};

/**
 * READ LIST:  fires on /types/GET uses types.list
 * should respond with JSON array containing inserted type data objects
 */
exports.list = function(req, res) {
	Type.find().sort('-created').populate('user', 'displayName').exec(function(err, types) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(types);
		}
	});
};

/**
 * UPDATE:  fires on /types/:typeId PUT type_data  uses types.update
 * should require authentication
 * should respond 404 when wrong typeIt are given
 * should respond 400 "resource id does not match object id" if data contains _id and it not match :typeId
 * should respond 400 "Please fill Type title" when POST with no or empty title
 * should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl
 * should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl
 * should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl
 * should respond type_data had been PUT
 */
exports.update = function(req, res) {
	var type = req.type ;

	type = _.extend(type , req.body);

	type.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(type);
		}
	});
};

/**
 * READ: fires on /types/:typeId GET  uses types.read
 * should respond with type_data have been PUT
 */
exports.read = function(req, res) {
	res.jsonp(req.type);
};

/**
 * DELETE: fires on /types/:typeId DELETE  uses types.delete
 * should require authorization
 * should respond 404 when wrong typeIt are given
 * /types/:typeId GET should respond 404 after DELETE with :typeId
 */
exports.delete = function(req, res) {
	var type = req.type ;

	type.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(type);
		}
	});
};


/**
 * Type middleware
 */
exports.typeByID = function(req, res, next, id) { 
	Type.findById(id).populate('user', 'displayName').exec(function(err, type) {
		if (err) return next(err);
		if (! type)
			return res.status(404).send({
				message: errorHandler.getErrorMessage(new Error('Failed to load Type ' + id))
			});
		req.type = type ;
		next();
	});
};

/**
 * Type authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.type.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
