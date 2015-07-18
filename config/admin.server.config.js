'use strict';
var _ = require('lodash');

module.exports = function(config) {
  return {
    /**
     * Get the modules JavaScript files
     */
    getJavaScriptAssets : function(root, includeTests) {
      var output = config.getGlobbedFiles(config.assets.admin.lib.js, root);
      //root js
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/*.js';
      }), root));
      //other js
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/*[!tests]*/*.js';
      }), root));
      // To include tests
      if (includeTests) {
        output = _.union(output, config.getGlobbedFiles(config.assets.admin.tests));
      }
      return output;
    },
    /**
     * Get the modules CSS files
     */
    getCSSAssets : function(root) {
      var output = config.getGlobbedFiles(config.assets.admin.lib.css, root);
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/**/*.css';
      }), root));
      return output;
    }
  };
};