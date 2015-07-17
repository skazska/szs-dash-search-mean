'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./config/config');

// Karma configuration
module.exports = function(config) {
  config.set({

    preprocessors: {
      'public/modules/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'templates',
      //prependPrefix: 'app/'
      stripPrefix: 'public/'
    },

		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
    files: applicationConfiguration.getJavaScriptAssets('', false).concat(
      applicationConfiguration.admin.getJavaScriptAssets('', false),
      applicationConfiguration.assets.tests,
      ['public/**/*.html']
    ),
//		files: applicationConfiguration.assets.lib.js.concat(
//      applicationConfiguration.assets.js,
//      applicationConfiguration.assets.tests
//    ),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress'],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
//		browsers: ['PhantomJS'],
    browsers: ['Firefox'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
//		singleRun: true
    singleRun: true

  });

};