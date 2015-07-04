'use strict';

module.exports = function(app, config) {
  var router = require("express").Router();
  var path = require("path");
  app.use('/admin', router);
  // Globbing routing files
  config.getGlobbedFiles('./app/admin-routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(router);
//    require(routePath)(router);
  });

};