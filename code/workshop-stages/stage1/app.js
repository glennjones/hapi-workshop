var Hapi 		= require('hapi'),
	Routes    	= require('./lib/routes.js');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 3005);

// Add the route
server.route(Routes.routes);

// Start the server
server.start();