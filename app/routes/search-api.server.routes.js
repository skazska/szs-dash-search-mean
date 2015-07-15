'use strict';

module.exports = function(app, config) {
  var router = require("express").Router();
  var path = require("path");
  var errorHandler = require('../controllers/errors.server.controller');

  app.use('/search-api', router);
  // Globbing routing files
  config.getGlobbedFiles('./app/search-api-routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(router);
  });

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  router.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) return next();

    // Log it
    console.error(err.stack);

    return res.status(500).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

  // Assume 404 since no middleware responded
  router.use(function(req, res) {
    return res.status(404).send({
      message: 'Not Found',
      url: req.originalUrl
    });
  });


};