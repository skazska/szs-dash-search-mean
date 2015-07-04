'use strict';

module.exports = function(app, config) {
  var router = require("express").Router();
  var path = require("path");

  app.use('/search-api', router);
  // Globbing routing files
  config.getGlobbedFiles('./app/search-api-routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(router);
  });
  
};