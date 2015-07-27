'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Type = mongoose.model('Type'),
	_ = require('lodash');

/**
 * Create a Type
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
 * Show the current Type
 */
exports.read = function(req, res) {
	res.jsonp(req.type);
};

/**
 * Update a Type
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
 * Delete an Type
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
 * List of Types
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
 * Type middleware
 */
exports.typeByID = function(req, res, next, id) { 
	Type.findById(id).populate('user', 'displayName').exec(function(err, type) {
		if (err) return next(err);
		if (! type) return next(new Error('Failed to load Type ' + id));
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
