var Hapi    = require('hapi')


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


// Add a simple route
server.route({ 
    method: 'GET', 
    path: '/', 
    handler: function (request, reply) {
        reply('hello');
    } 
});



var goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
    }]
};


// Register plug-in and start
server.register({
    register: require('good'),
    options: goodOptions
}, function (err) {
    if (err) {
        console.error(err);
    }else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});


