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


// Create hash for string 'password'
/*Bcrypt.hash('password', null, null, function (err, hash) {
  console.log(err, hash);
});*/

// Create a validation function for strategy
var validate = function (username, password, callback) {
    var user = users[username];
    if (!user) {
        return callback(null, false);
    }
    Bcrypt.compare(password, user.password, function (err, isValid) {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


// Add the basic-auth plug-in
server.register(require('hapi-auth-basic'), function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });
});


// Add a simple route
server.route({ 
    method: 'GET', 
    path: '/', 
    config: { auth: 'simple' },
    handler: function (request, reply) {
        var name = request.auth.credentials.name
        reply('hello ' + name);
    } 
});

server.start();


