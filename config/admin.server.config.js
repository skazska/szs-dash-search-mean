'use strict';

module.exports = function(config) {
  return {
    /**
     * Get the modules JavaScript files
     */
    getJavaScriptAssets : function(includeTests) {
      var output = config.getGlobbedFiles(config.assets.admin.lib.js, 'public/');

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
      return output;
    }
  };
};