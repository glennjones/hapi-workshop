'use strict';
var Hapi            = require('hapi'),
    Mongo           = require('mongodb'),
    Pack            = require('./package'),
    Config          = require('./lib/config-manager.js'),
    Routes          = require('./lib/routes.js'),
    Auth            = require('./lib/auth.js');


var auth,
    server,
    serverOptions = {},
    swaggerOptions = {},
    goodOptions = {};


// create hapi server object    
server = Hapi.createServer(Config.server.host, Config.server.port, serverOptions);


// hapi-swagger plug-in options
swaggerOptions = {
    basePath: server.info.uri,
    apiVersion: Pack.version
};

// good plug-in options
goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', request: '*' }]
    }]
};




// adds swagger self documentation plugin
server.pack.register([{
        plugin: require('hapi-swagger'), 
        options: swaggerOptions
    },{
        plugin: require('good'),
        options: goodOptions
    },{
        plugin: require('hapi-auth-basic')
    },{
        plugin: require('hapi-auth-bearer-token')
    },{
        plugin: require('hapi-auth-cookie')
    }], function (err) {
    if (err) {
        console.error(err);
    }else{

        // add auth strategies
        server.auth.strategy('basic', 'basic', { validateFunc: Auth.validateBasic});
        server.auth.strategy('bearer', 'bearer-access-token', {validateFunc: Auth.validateBearer});
        server.auth.strategy('cookie', 'cookie', {
            password: '72F9b7!5-cCb0-44H5-8^f2-374&5%40d53e',
            cookie: 'sid',
            redirectTo: '/logon',
            isSecure: false,
            validateFunc: Auth.validateCookie
        });


        // hapi server settings
        server.route(Routes);
        server.views({
                path: 'templates',
                engines: { html: require('handlebars') },
                partialsPath: './templates/withPartials',
                helpersPath: './templates/helpers',
                isCached: false
            })

        server.start(function(){
            console.info('Server started at ' + server.info.uri);
        });
    }
});




