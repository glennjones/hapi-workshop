'use strict';
var Hapi            = require('hapi'),
    Boom            = require("boom"),
    Mongo           = require('mongodb'),
    Pack            = require('./package'),
    Routes          = require('./lib/routes.js');


var server,
    swaggerOptions,
    dbOptions,
    host = (process.env.HOST)? process.env.HOST : 'localhost',
    port = (process.env.PORT)? parseInt(process.env.PORT, 10) : 3005;


// create server
server = Hapi.createServer(host, port);


swaggerOptions = {
    basePath: 'http://localhost:3005',
    payloadType: 'form'
},



// create options for connection to mongodb
dbOptions = {
    "url": "mongodb://localhost:27017/bookmarks"
};

// add hapi-mongodb plug-in
server.pack.register([{
    plugin: require('hapi-swagger'), 
    options: swaggerOptions
},{
    plugin: require('hapi-mongodb'),
    options: dbOptions
}], function (err) {
    if (err) {
        console.error(err);
    }else{

        // hapi server settings
        server.route(Routes.routes);
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








