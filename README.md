
This project based on MEAN stack framework. [![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)](http://meanjs.org/)

Stack:
1. MongoDb is used as data storage through mongoose - mongodb connectivity and scheming
2. Express is used as web framework, provides MVC, routing, templating, HTTP request - response API, extendable by middleware
3. AngularJs is used as front-end framework for browser, utilises html, css, javascript, MVC.
4. NodeJs is used as server side javascript processor. 


##Project layout
###Server side
Server side related files have next layout:
    \->server.js #inits and runs server instance
    |->app #server side modules files reside there
    |  \->controllers #modules business logic functional to process requests and data & compose response
    |  |->models #modules data models on mongoose
    |  |->routes #modules express routing configurations bind requests with controllers
    |  |->tests #modules server side unit test scripts (mocha/should)
    |  \->views #html templates of initial html of front-ends, forms or error pages 
    |->config #server side configurations reside there
    |  \->env #project configurations for different environments (dev, test, prod)
    |  |->sslcerts #
    |  |->strategies #passportJS authentication strategies here
    |  |->config.js #script loads environment configuration (process.env.NODE_ENV) and provides functions 
    |  |            #returning runtime file lists (js, css) for front-end
    |  |->express.js #express initialisation and configuration script
    |  |->init.js #does something with environments (don't get it yet)
    |  \->passport auth module initialization
    |->package.json, bower.json #sercver and front-end package managers configs
    |->karma.conf.js #front-end unit testing configuration
    |->gruntfile.js #project task manager configuration
    |
    |->public #front-end files
    |  \->modules #modules front end files reside there 
    |     \->{module_name} #each module contains angular modules structure elements and assets
    |        \->config
    |        |->controllers
    |        |->css
    |        |->directives
    |        |->filters
    |        |->img
    |        |->services
    |        |->tests
    |        |->views
    |        |-{module_name}.client.module.js  #registers angular modules to bootstrap
    |->application.js  # bootstraps f-e
    \->config.js # registers modules


  
