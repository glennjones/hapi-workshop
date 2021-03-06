var Hapi    = require('hapi');


// Create a validation function for strategy
var validate = function (token, callback) {
    if(token === "d294b4b6-4d65-4ed8-808e-26954168ff48"){
        callback(null, true, { token: token })
    } else {
        callback(null, false)
    }
};


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000
});


// Add the bearer-auth plug-in
server.register(require('hapi-auth-bearer-token'), function (err) {
    server.auth.strategy('bearer', 'bearer-access-token', {
        validateFunc: validate
    });
});


// Add a simple route
server.route({ 
    method: 'GET', 
    path: '/', 
    config: { 
        cors: true,
        jsonp: 'callback',
        auth: {strategies:['bearer']}
    },
    handler: function (request, reply) {
        var token = request.auth.credentials.token
        reply( '{"hello": "' + token +'"}' )
            .type('application/json');
    } 
});

server.start();


