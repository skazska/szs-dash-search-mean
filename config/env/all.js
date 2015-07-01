'use strict';

module.exports = {
	app: {
		title: 'szs-dash-search-mean',
		description: 'MEAN stack',
		keywords: 'MongoDB, Express, AngularJS, Node.js, Search interface'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
    admin: {
      lib: {
        css: [
        ],
        js: [
        ]
      },
      modulePrefix:'public/modules/',
      modules:[
        'options',
        'opt-items',
        'records'
      ]
    },
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/core/*.js',
			'public/modules/core/*[!tests]*/*.js',
      'public/modules/users/*.js',
      'public/modules/users/*[!tests]*/*.js'
//			'public/modules/*/*.js',
//			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};