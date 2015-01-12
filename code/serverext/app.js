var Hapi    = require('hapi'),
    Pack    = require('./package');


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


server.ext('onPreResponse', function(request, reply) {
    request.response.header('X-API-VERSION', Pack.version);
    return reply.continue();
});


server.ext('onPreResponse', function(request, reply) {
    request.response.header('X-API-LICENSE', Pack.license);
    return reply.continue();
});


// Add a simple route
server.route({ 
    method: 'GET', 
    path: '/', 
    handler: function (request, reply) {
        reply('Please inspect the headers of this response');
    } 
});


server.start();

