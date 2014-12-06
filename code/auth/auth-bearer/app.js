var Hapi    = require('hapi');


// Create a validation function for strategy
var validate = function (token, callback) {
    if(token === "d294b4b6-4d65-4ed8-808e-26954168ff48"){
        callback(null, true, { token: token })
    } else {
        callback(null, false, { token: token })
    }
};


// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000, {
    cors: true,
    jsonp: 'callback'
});


// Add the bearer-auth plug-in
server.pack.register(require('hapi-auth-bearer-token'), function (err) {
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


