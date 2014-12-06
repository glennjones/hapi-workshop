var Hapi    = require('hapi'),
    Bcrypt  = require('bcrypt-nodejs');


// Create a in memory collections of users
var users = {
    jane: {
        username: 'jane',
        password: '$2a$10$XPk.7lupEzBSHxUg/IavSuIKmwmpBbW0NfCL8q0ZfHXUPXTtbhmNK',   // 'password'
        name: 'Jane Doe',
        id: '2133d32a'
    }
};



// Create a validation function for strategy
var validateBasic = function (username, password, callback) {
    var user = users[username];
    if (!user) {
        return callback(null, false);
    }
    Bcrypt.compare(password, user.password, function (err, isValid) {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};



// Create a validation function for strategy
var validateBearer = function (token, callback) {
    if(token === "d294b4b6-4d65-4ed8-808e-26954168ff48"){
        callback(null, true, { token: token })
    } else {
        callback(null, false, { token: token })
    }
};


// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);



// Add the basic-auth plug-in
server.pack.register(require('hapi-auth-basic'), function (err) {
    server.auth.strategy('basic', 'basic', { 
        validateFunc: validateBasic 
    });
});


// Add the bearer-auth plug-in
server.pack.register(require('hapi-auth-bearer-token'), function (err) {
    server.auth.strategy('bearer', 'bearer-access-token', {
        validateFunc: validateBearer
    });
});


// Add a simple route
server.route({ 
    method: 'GET', 
    path: '/', 
    config: {
        cors: true,
        jsonp: 'callback', 
        auth: {strategies:['basic','bearer']}
    },
    handler: function (request, reply) {

        var name = '';

        if(request.auth.credentials.token){
          name = request.auth.credentials.token  
        }
        if(request.auth.credentials.name){
          name = request.auth.credentials.name  
        }
         reply( '{"hello": "' + name +'"}' )
            .type('application/json');

    } 
});

server.start();


