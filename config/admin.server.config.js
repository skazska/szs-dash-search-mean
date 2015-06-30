'use strict';
var _ = require('lodash');

module.exports = function(config) {
  return {
    /**
     * Get the modules JavaScript files
     */
    getJavaScriptAssets : function(includeTests) {
      var output = config.getGlobbedFiles(config.assets.admin.lib.js, 'public/');
      //root js
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/*.js';
      }), 'public/'));
      //other js
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/*[!tests]*/*.js';
      }), 'public/'));
      /*
      // To include tests
      if (includeTests) {
        output = _.union(output, config.getGlobbedFiles(this.assets.tests));
      }
      */
      return output;
    },
    /**
     * Get the modules CSS files
     */
    getCSSAssets : function() {
      var output = config.getGlobbedFiles(config.assets.admin.lib.css, 'public/');
      output = _.union(output, config.getGlobbedFiles(config.assets.admin.modules.map(function(modName){
        return config.assets.admin.modulePrefix+modName+'/**/*.css';
      }), 'public/'));
      return output;
    }
  };
};