'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	OptItem = mongoose.model('OptItem'),
	_ = require('lodash');

/**
 * Create a Opt item
 */
exports.create = function(req, res) {
	var optItem = new OptItem(req.body);
	console.log(req.params);
  optItem.option = req.params.optionId;
  optItem.user = req.user;

	optItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(optItem);
		}
	});
};

/**
 * Show the current Opt item
 */
exports.read = function(req, res) {
	res.jsonp(req.optItem);
};

/**
 * Update a Opt item
 */
exports.update = function(req, res) {
	var optItem = req.optItem ;

	optItem = _.extend(optItem , req.body);

	optItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(optItem);
		}
	});
};

/**
 * Delete an Opt item
 */
exports.delete = function(req, res) {
	var optItem = req.optItem ;

	optItem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(optItem);
		}
	});
};

/**
 * List of Opt items
 */
exports.list = function(req, res) { 
  var cond;
  if (req.params.optionId) {
    cond = {option: req.params.optionId};
  }
	OptItem.find(cond).sort('-created').populate('user', 'displayName').exec(function(err, optItems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(optItems);
		}
	});
};

/**
 * Opt item middleware
 */
exports.optItemByID = function(req, res, next, id) { 
	OptItem.findById(id).populate('user', 'displayName').exec(function(err, optItem) {
		if (err) return next(err);
		if (! optItem) return next(new Error('Failed to load Opt item ' + id));
		req.optItem = optItem ;
		next();
	});
};

/**
 * Opt item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.optItem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
