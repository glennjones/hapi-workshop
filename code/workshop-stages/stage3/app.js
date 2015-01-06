var Hapi 		= require('hapi'),
	Mongo       = require('mongodb'),
	Routes    	= require('./lib/routes.js');

// connect to the database;
var db,
	dbConnectionUrl = 'mongodb://localhost:27017/bookmarks';

Mongo.MongoClient.connect(dbConnectionUrl, {'server': {'auto_reconnect': true}}, function (err, dbObj) {
  if (err) {
    console.log(['error', 'database', 'connection'], err);
  }else{
    db = dbObj;
    init();
  }
});


var swaggerOptions = {
	    basePath: 'http://localhost:3005'
	},
    server;

function init(){

	Routes.init(db);

    // Create a server with a host and port
    server = new Hapi.Server();
    server.connection({ 
        host: 'localhost', 
        port: 3005 
    });


    // Add the route
    server.route(Routes.routes);
    server.views({
        path: 'templates',
        engines: { html: require('handlebars') },
        partialsPath: './templates/withPartials',
        helpersPath: './templates/helpers',
        isCached: false
    })

    // adds swagger self documentation plugin
    server.register({
            register: require('hapi-swagger'), 
            options: swaggerOptions
        }, function (err) {
            if (err) {
                console.log(['error'], 'plugin "hapi-swagger" load error: ' + err) 
            }
        });

    server.start(function(){
        console.info('server started at ' + server.info.uri);
    });

}