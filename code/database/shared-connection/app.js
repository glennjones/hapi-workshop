'use strict';
var Hapi            = require('hapi'),
    Boom            = require("boom"),
    Mongo           = require('mongodb'),
    Pack            = require('./package'),
    Config          = require('./lib/config-manager.js'),
    Routes          = require('./lib/routes.js');


var server,
    swaggerOptions;


// create server
server = new Hapi.Server();
server.connection({ 
    host: Config.server.host, 
    port: Config.server.port 
});


swaggerOptions = {
    basePath: server.info.uri,
    payloadType: 'form'
},


// add hapi-mongodb plug-in
server.register([{
    register: require('hapi-swagger'), 
    options: swaggerOptions
}], function (err) {
    if (err) {
        console.error(err);
    }else{

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
            console.info('server started at ' + server.info.uri);
        });

    }
});








