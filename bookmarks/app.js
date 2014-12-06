var Hapi 		= require('hapi'),
	Mongo           = require('mongodb'),
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

	server = Hapi.createServer('localhost', 3005);

  	// adds swagger self documentation plugin
    server.pack.register([{
            plugin: require('hapi-swagger'), 
            options: swaggerOptions
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

}