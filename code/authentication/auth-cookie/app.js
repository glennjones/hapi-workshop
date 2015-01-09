var Hapi    = require('hapi'),
    Bcrypt  = require('bcrypt-nodejs');

var users = {
    jane: {
        id: 'jane',
        password: '$2a$10$XPk.7lupEzBSHxUg/IavSuIKmwmpBbW0NfCL8q0ZfHXUPXTtbhmNK',   // 'password'
        name: 'Jane Doe',
        revokingToken: 'd294b4b6-4d65-4ed8-808e-26954168ff48'
    }
};


var home = function (request, reply) {
    reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + request.auth.credentials.name
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};


var login = function (request, reply) {
    var message = '',
        account = null;

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            message = 'Missing username or password';
        } else {
            account = users[request.payload.username];
            if (account){
                Bcrypt.compare(request.payload.password, account.password, function (err, isValid) {
                    if(err || isValid === false){
                        return displayLogin(reply, 'Invalid username or password')
                    }else{
                        request.auth.session.set(account);
                        return reply.redirect('/');
                    }
                });
            }else{
                message = 'Invalid username or password';   
            }
        }
        if (message !== '') {
            return displayLogin(reply, message);
        }
    }

    if (request.method === 'get') {
        return displayLogin(reply, '');
    }
};


var logout = function (request, reply) {
    request.auth.session.clear();
    return reply.redirect('/');
};


function displayLogin(reply, message){
     return reply('<html><head><title>Login page</title></head><body>'
        + (message ? '<h3>' + message + '</h3><br/>' : '')
        + '<form method="post" action="/login">'
        + 'Username: <input type="text" name="username"><br>'
        + 'Password: <input type="password" name="password"><br/>'
        + '<input type="submit" value="Login"></form></body></html>');
}


function validate(session, callback) {
    var account = users[session.id];

    if(account){
        if (session.revokingToken !== account.revokingToken) {
            return callback(null, false);
        }

        Bcrypt.compare(session.password, account.password, function (err, isValid) {
            callback(null, true, account);
        });
    }else{
        return callback(null, false);
    }
}


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


server.register(require('hapi-auth-cookie'), function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: validate
    });

    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                handler: home,
                auth: 'session'
            }
        },{
            method: ['GET', 'POST'],
            path: '/login',
            config: {
                handler: login,
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },{
            method: 'GET',
            path: '/logout',
            config: {
                handler: logout,
                auth: 'session'
            }
        }
    ]);

    server.start();
});