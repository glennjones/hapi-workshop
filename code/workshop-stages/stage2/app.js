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

function init(){

	Routes.init(db);
	

	// Create a server with a host and port
	var server = new Hapi.Server('localhost', 3005);

	// Add the route
	server.route(Routes.routes);
	    server.views({
	                    path: 'templates',
	                    engines: { html: require('handlebars') },
	                    partialsPath: './templates/withPartials',
	                    helpersPath: './templates/helpers',
	                    isCached: false
	                })


	// Start the server
	server.start();

}