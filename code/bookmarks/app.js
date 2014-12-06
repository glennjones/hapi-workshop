'use strict';
var Hapi            = require('hapi'),
    Mongo           = require('mongodb'),
    Pack            = require('./package'),
    Routes          = require('./lib/routes.js'),
    Auth            = require('./lib/auth.js').Auth;


var serverMode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development',
    auth,
    server,
    protocol = 'http://',
    host = (process.env.HOST)? process.env.HOST : 'localhost',
    port = (process.env.PORT)? parseInt(process.env.PORT, 10) : 3005,
    db = null,
    dbConnectionUrl = 'mongodb://localhost:27017/bookmarks',
    serverOptions = {},
    swaggerOptions = {},
    goodOptions = {};


// create hapi server object    
server = Hapi.createServer(host, port, serverOptions);


// connect to the database;
Mongo.MongoClient.connect(dbConnectionUrl, {'server': {'auto_reconnect': true}}, function (err, dbObj) {
  if (err) {
    console.log(['error', 'database', 'connection'], err);
  }else{
    db = dbObj;
    init();
  }
});




// hapi-swagger plug-in options
swaggerOptions = {
    basePath: protocol + host + ':' + port,
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





function init(){

    Routes.init(db);
    var auth = new Auth(db);

    function validateBasic(username, password, callback){
        auth.validateBasic(username, password, callback)
    }

    function validateBearer(token, callback){
        auth.validateBearer(token, callback)
    }

    function validateCookie(token, callback){
        auth.validateCookie(token, callback)
    }



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
            server.auth.strategy('basic', 'basic', { validateFunc: validateBasic});
            server.auth.strategy('bearer', 'bearer-access-token', {validateFunc: validateBearer});
            server.auth.strategy('cookie', 'cookie', {
                password: '72F9b7!5-cCb0-44H5-8^f2-374&5%40d53e',
                cookie: 'sid',
                redirectTo: '/logon',
                isSecure: false,
                validateFunc: validateCookie
            });


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
}



